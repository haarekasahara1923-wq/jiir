import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Role, AccountStatus } from "@prisma/client";

// Extend the session type to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      status: AccountStatus;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    status: AccountStatus;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          include: {
            profile: {
              select: { fullName: true },
            },
          },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        if (user.status === "BLOCKED") {
          throw new Error(
            `BLOCKED:${user.blockedReason ?? "Your account has been blocked. Please contact the editorial office."}`
          );
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.fullName ?? user.email,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.status = (user as any).status;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.status = token.status as AccountStatus;
        session.user.name = (token.name as string) ?? session.user.email;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  events: {
    async signIn({ user }) {
      // Audit log
      try {
        if (user?.id) {
          await prisma.auditLog.create({
            data: {
              actorId: user.id,
              action: "LOGIN",
              entity: "User",
              entityId: user.id,
            },
          });
        }
      } catch {
        // Non-critical — don't fail the login
      }
    },
  },
});
