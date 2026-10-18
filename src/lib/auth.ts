import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Role, AccountStatus } from "@prisma/client";

import { authConfig } from "./auth.config";

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
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
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
