import { PrismaClient, IndexStatus, IssueStatus, ArticleType, AuthorRegion, Currency } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding JIIR database...");

  // ─────────────────────────────────────────────
  // 1. SUPER ADMIN
  // ─────────────────────────────────────────────
  const adminEmail = process.env.SEED_SUPERADMIN_EMAIL ?? "admin@jiir.in";
  const adminPassword = process.env.SEED_SUPERADMIN_PASSWORD ?? "Admin@JIIR2026!";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            fullName: "JIIR Super Admin",
            country: "India",
          },
        },
      },
    });
    console.log(`✅ Super Admin created: ${admin.email}`);
  } else {
    console.log(`⏭  Super Admin already exists: ${adminEmail}`);
  }

  // ─────────────────────────────────────────────
  // 2. SITE SETTINGS
  // ─────────────────────────────────────────────
  const settings: Record<string, any> = {
    journalName: "Journal of Interdisciplinary Innovation & Research",
    journalNameHi: "अंतःविषय नवाचार एवं अनुसंधान जर्नल",
    abbreviation: "JIIR",
    tagline: "Advancing Knowledge Across Disciplines",
    taglineHi: "विधाओं में ज्ञान को आगे बढ़ाना",
    motto: "Educate · Innovate · Collaborate",
    publisher: "JIIR Publications",
    publisherAddress: "India",
    frequency: "Monthly",
    languages: ["English", "Hindi"],
    subjects: [
      "Management & Business",
      "Education",
      "Hospitality, Tourism & Hotel Management",
      "Science",
      "Technology & Engineering",
    ],
    logoLight: "/brand/logo.png",
    logoDark: "/brand/logo.png",
    favicon: "/brand/favicon.ico",
    ogImage: "/brand/og-image.png",
    issnPrint: "",
    issnOnline: "",
    openAccessPolicy: "",
    copyrightPolicy: "",
    // Addresses
    journalOfficeAddress: "JIIR Editorial Office\nAddress Line 1\nCity, State — PIN Code\nIndia",
    editorialBoardAddress: "JIIR Editorial Board Office\nAddress Line 1\nCity, State — PIN Code\nIndia",
    phone: "+91 00000 00000",
    whatsapp: "+91 00000 00000",
    email: "editor@jiir.in",
    email2: "info@jiir.in",
    googleMapsLink: "",
    googleMapsEmbed: "",
    // Social
    socialTwitter: "",
    socialFacebook: "",
    socialLinkedin: "",
    socialInstagram: "",
    socialYoutube: "",
    // Footer
    footerCopyright: "© {year} Journal of Interdisciplinary Innovation & Research. All rights reserved.",
    footerTagline: "A peer-reviewed multidisciplinary research journal dedicated to advancing knowledge across disciplines.",
    // Feature toggles
    darkModeEnabled: true,
    hindiEnabled: true,
    maintenanceMode: false,
    maintenanceMessage: "JIIR is undergoing scheduled maintenance. We will be back shortly.",
    cookieBannerText:
      "This website uses essential cookies for functionality and analytics. By continuing, you agree to our Privacy Policy.",
    announcementBarEnabled: false,
    announcementBarText: "",
    whatsappFloatEnabled: true,
    manualPaymentEnabled: true,
    // Manuscript settings
    manuscriptCodePrefix: "JIIR",
    manuscriptCodeFormat: "PREFIX-YYYY-NNNN",
    // Payment timing
    paymentTiming: "AFTER_ACCEPTANCE",
    // Counters (also stored in Counter table for atomicity)
    // GA
    googleAnalyticsId: "",
    // Timezone
    timezone: "Asia/Kolkata",
    defaultLanguage: "en",
    // SEO defaults
    seoTitle: "JIIR — Journal of Interdisciplinary Innovation & Research",
    seoDescription:
      "JIIR is a peer-reviewed academic journal publishing original research across management, education, hospitality, science, and technology disciplines.",
    // DOI
    doiRegistrationStatus: "PLANNED",
    doiRegistrar: "Crossref",
    doiStatusNote: "DOI registration is planned. Articles will be assigned DOIs upon registration.",
    // ISSN
    issnNote: "ISSN application is in progress.",
    // Indexing statement
    indexingStatement:
      "JIIR is actively pursuing indexing in major databases. Current status is available on the Indexing & Abstracting page.",
    // Open access statement
    openAccessStatement:
      "Access and reuse terms for JIIR content are to be announced. Please contact the editorial office for permissions.",
    // Enquiry types
    enquiryTypes: [
      "General",
      "Submission",
      "Payment",
      "Review",
      "Institutional",
      "Conference",
      "Technical",
      "Other",
    ],
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log("✅ Site settings seeded");

  // ─────────────────────────────────────────────
  // 3. COUNTERS
  // ─────────────────────────────────────────────
  const counters = [
    { key: "manuscript", value: 0 },
    { key: "invoice", value: 0 },
    { key: "cert_acc", value: 0 },
    { key: "cert_pub", value: 0 },
    { key: "cert_rev", value: 0 },
    { key: "cert_edi", value: 0 },
    { key: "cert_par", value: 0 },
  ];
  for (const c of counters) {
    await prisma.counter.upsert({
      where: { key: c.key },
      update: {},
      create: c,
    });
  }
  console.log("✅ Counters initialized");

  // ─────────────────────────────────────────────
  // 4. FEE PLANS
  // ─────────────────────────────────────────────
  const existingFeePlans = await prisma.feePlan.count();
  if (existingFeePlans === 0) {
    await prisma.feePlan.createMany({
      data: [
        {
          region: AuthorRegion.INDIA,
          currency: Currency.INR,
          withoutDoiAmount: 800,
          withDoiAmount: 1000,
          maxAuthors: 7,
          maxPagesWithDoi: 30,
          extraPagePrice: 50,
          gstPercent: null,
          notes: "For corresponding authors from India. Fees are in Indian Rupees. Payment due only after acceptance and fee request. DOI option includes up to 30 pages; extra pages at ₹50/page.",
        },
        {
          region: AuthorRegion.INTERNATIONAL,
          currency: Currency.USD,
          withoutDoiAmount: 40,
          withDoiAmount: 50,
          maxAuthors: 6,
          maxPagesWithDoi: 30,
          extraPagePrice: 3,
          gstPercent: null,
          notes: "For corresponding authors outside India. Fees are in US Dollars. Payment due only after acceptance and fee request. DOI option includes up to 30 pages.",
        },
      ],
    });
    console.log("✅ Fee plans seeded");
  }

  // ─────────────────────────────────────────────
  // 5. NAVIGATION
  // ─────────────────────────────────────────────
  const existingNavItems = await prisma.navItem.count();
  if (existingNavItems === 0) {
    await prisma.navItem.createMany({
      data: [
        // HEADER main menu
        { label: "Home", labelHi: "होम", href: "/", area: "HEADER", sortOrder: 1 },
        { label: "Current Issue", labelHi: "वर्तमान अंक", href: "/current-issue", area: "HEADER", sortOrder: 2 },
        { label: "Past Issues", labelHi: "पिछले अंक", href: "/past-issues", area: "HEADER", sortOrder: 3 },
        { label: "Pay Online", labelHi: "ऑनलाइन भुगतान", href: "/pay-online", area: "HEADER", sortOrder: 4 },
        { label: "Conferences", labelHi: "सम्मेलन", href: "/conferences", area: "HEADER", sortOrder: 5 },
        { label: "For Authors", labelHi: "लेखकों के लिए", area: "FOR_AUTHORS", sortOrder: 6 },
        { label: "For Institutions", labelHi: "संस्थानों के लिए", area: "FOR_INSTITUTIONS", sortOrder: 7 },
        { label: "Editorial Board", labelHi: "संपादकीय बोर्ड", href: "/editorial-board", area: "HEADER", sortOrder: 8 },
        { label: "About Us", labelHi: "हमारे बारे में", href: "/about", area: "HEADER", sortOrder: 9 },
        { label: "Contact Us", labelHi: "संपर्क करें", href: "/contact", area: "HEADER", sortOrder: 10 },
        { label: "Submit Manuscript", labelHi: "पांडुलिपि प्रस्तुत करें", href: "/submit-manuscript", area: "HEADER", sortOrder: 11 },
        { label: "Track Manuscript", labelHi: "पांडुलिपि ट्रैक करें", href: "/track-manuscript", area: "HEADER", sortOrder: 12 },

        // FOR_AUTHORS dropdown
        { label: "Author Guidelines", labelHi: "लेखक दिशानिर्देश", href: "/author-guidelines", area: "FOR_AUTHORS", sortOrder: 1 },
        { label: "Submit Manuscript", labelHi: "पांडुलिपि प्रस्तुत करें", href: "/submit-manuscript", area: "FOR_AUTHORS", sortOrder: 2 },
        { label: "Track Manuscript", labelHi: "पांडुलिपि ट्रैक करें", href: "/track-manuscript", area: "FOR_AUTHORS", sortOrder: 3 },
        { label: "Article Processing Charges", labelHi: "आलेख प्रसंस्करण शुल्क", href: "/article-processing-charges", area: "FOR_AUTHORS", sortOrder: 4 },
        { label: "Publication Ethics", labelHi: "प्रकाशन नैतिकता", href: "/publication-ethics", area: "FOR_AUTHORS", sortOrder: 5 },
        { label: "Peer Review Policy", labelHi: "सहकर्मी समीक्षा नीति", href: "/peer-review-policy", area: "FOR_AUTHORS", sortOrder: 6 },
        { label: "Publication Procedure", labelHi: "प्रकाशन प्रक्रिया", href: "/publication-procedure", area: "FOR_AUTHORS", sortOrder: 7 },
        { label: "Call for Papers", labelHi: "शोध पत्र आमंत्रण", href: "/call-for-papers", area: "FOR_AUTHORS", sortOrder: 8 },
        { label: "Author Resources", labelHi: "लेखक संसाधन", href: "/author-resources", area: "FOR_AUTHORS", sortOrder: 9 },
        { label: "FAQ", labelHi: "सामान्य प्रश्न", href: "/faq", area: "FOR_AUTHORS", sortOrder: 10 },

        // FOR_INSTITUTIONS dropdown
        { label: "Institutional Membership", labelHi: "संस्थागत सदस्यता", href: "/institutional-membership", area: "FOR_INSTITUTIONS", sortOrder: 1 },
        { label: "Research Collaboration", labelHi: "अनुसंधान सहयोग", href: "/research-collaboration", area: "FOR_INSTITUTIONS", sortOrder: 2 },
        { label: "Conference Collaboration", labelHi: "सम्मेलन सहयोग", href: "/conference-collaboration", area: "FOR_INSTITUTIONS", sortOrder: 3 },
        { label: "Institutional Services", labelHi: "संस्थागत सेवाएं", href: "/institutional-services", area: "FOR_INSTITUTIONS", sortOrder: 4 },

        // FOOTER_COL1 (Explore)
        { label: "Home", href: "/", area: "FOOTER_COL1", sortOrder: 1 },
        { label: "Current Issue", href: "/current-issue", area: "FOOTER_COL1", sortOrder: 2 },
        { label: "Past Issues", href: "/past-issues", area: "FOOTER_COL1", sortOrder: 3 },
        { label: "Editorial Board", href: "/editorial-board", area: "FOOTER_COL1", sortOrder: 4 },
        { label: "About Us", href: "/about", area: "FOOTER_COL1", sortOrder: 5 },
        { label: "Aims & Scope", href: "/aims-scope", area: "FOOTER_COL1", sortOrder: 6 },
        { label: "Indexing & Abstracting", href: "/indexing", area: "FOOTER_COL1", sortOrder: 7 },
        { label: "Journal Information", href: "/journal-information", area: "FOOTER_COL1", sortOrder: 8 },

        // FOOTER_COL2 (For Authors)
        { label: "Author Guidelines", href: "/author-guidelines", area: "FOOTER_COL2", sortOrder: 1 },
        { label: "Submit Manuscript", href: "/submit-manuscript", area: "FOOTER_COL2", sortOrder: 2 },
        { label: "Track Manuscript", href: "/track-manuscript", area: "FOOTER_COL2", sortOrder: 3 },
        { label: "APC & Fees", href: "/article-processing-charges", area: "FOOTER_COL2", sortOrder: 4 },
        { label: "Call for Papers", href: "/call-for-papers", area: "FOOTER_COL2", sortOrder: 5 },
        { label: "Author Resources", href: "/author-resources", area: "FOOTER_COL2", sortOrder: 6 },
        { label: "FAQ", href: "/faq", area: "FOOTER_COL2", sortOrder: 7 },

        // FOOTER_POLICIES
        { label: "Privacy Policy", href: "/privacy", area: "FOOTER_POLICIES", sortOrder: 1 },
        { label: "Terms of Use", href: "/terms", area: "FOOTER_POLICIES", sortOrder: 2 },
        { label: "Copyright & Licensing", href: "/copyright", area: "FOOTER_POLICIES", sortOrder: 3 },
        { label: "Refund & Cancellation", href: "/refund-policy", area: "FOOTER_POLICIES", sortOrder: 4 },
        { label: "Publication Ethics", href: "/publication-ethics", area: "FOOTER_POLICIES", sortOrder: 5 },
        { label: "Peer Review Policy", href: "/peer-review-policy", area: "FOOTER_POLICIES", sortOrder: 6 },

        // FOOTER_CONTACT
        { label: "Contact Us", href: "/contact", area: "FOOTER_CONTACT", sortOrder: 1 },
        { label: "Enquiries", href: "/contact?topic=General", area: "FOOTER_CONTACT", sortOrder: 2 },
        { label: "Editorial Board", href: "/editorial-board", area: "FOOTER_CONTACT", sortOrder: 3 },
      ],
    });
    console.log("✅ Navigation seeded");
  }

  // ─────────────────────────────────────────────
  // 6. RESEARCH AREAS
  // ─────────────────────────────────────────────
  const existingAreas = await prisma.researchArea.count();
  if (existingAreas === 0) {
    const areas = [
      {
        name: "Management & Business",
        nameHi: "प्रबंधन एवं व्यवसाय",
        icon: "briefcase",
        description: "Research in business management, HR, marketing, finance, and related disciplines.",
        sortOrder: 1,
        subtopics: [
          { name: "Business Management", showOnHome: true, sortOrder: 1 },
          { name: "Human Resource Management", showOnHome: true, sortOrder: 2 },
          { name: "Marketing Management", showOnHome: true, sortOrder: 3 },
          { name: "Financial Management", showOnHome: true, sortOrder: 4 },
          { name: "Strategic Management", showOnHome: true, sortOrder: 5 },
          { name: "Entrepreneurship", showOnHome: false, sortOrder: 6 },
          { name: "International Business", showOnHome: false, sortOrder: 7 },
          { name: "Organisational Behaviour", showOnHome: false, sortOrder: 8 },
          { name: "Operations Management", showOnHome: false, sortOrder: 9 },
          { name: "Banking & Finance", showOnHome: false, sortOrder: 10 },
          { name: "Commerce", showOnHome: false, sortOrder: 11 },
          { name: "Supply Chain & Logistics", showOnHome: false, sortOrder: 12 },
        ],
      },
      {
        name: "Education",
        nameHi: "शिक्षा",
        icon: "graduation-cap",
        description: "Research spanning pedagogy, educational technology, policy, and inclusive education.",
        sortOrder: 2,
        subtopics: [
          { name: "Education & Pedagogy", showOnHome: true, sortOrder: 1 },
          { name: "Educational Technology", showOnHome: true, sortOrder: 2 },
          { name: "Teacher Education", showOnHome: true, sortOrder: 3 },
          { name: "Higher Education", showOnHome: true, sortOrder: 4 },
          { name: "Educational Psychology", showOnHome: true, sortOrder: 5 },
          { name: "Curriculum & Instruction", showOnHome: false, sortOrder: 6 },
          { name: "Educational Administration & Management", showOnHome: false, sortOrder: 7 },
          { name: "Distance & Online Education", showOnHome: false, sortOrder: 8 },
          { name: "Inclusive Education", showOnHome: false, sortOrder: 9 },
          { name: "Educational Policy & NEP", showOnHome: false, sortOrder: 10 },
          { name: "Vocational & Skill Education", showOnHome: false, sortOrder: 11 },
        ],
      },
      {
        name: "Hospitality, Tourism & Hotel Management",
        nameHi: "आतिथ्य, पर्यटन एवं होटल प्रबंधन",
        icon: "hotel",
        description: "Research in hospitality operations, tourism, event management and sustainable travel.",
        sortOrder: 3,
        subtopics: [
          { name: "Hospitality Management", showOnHome: true, sortOrder: 1 },
          { name: "Hotel Management", showOnHome: true, sortOrder: 2 },
          { name: "Tourism Management", showOnHome: true, sortOrder: 3 },
          { name: "Travel & Tourism", showOnHome: true, sortOrder: 4 },
          { name: "Food & Beverage Management", showOnHome: true, sortOrder: 5 },
          { name: "Hospitality Marketing", showOnHome: false, sortOrder: 6 },
          { name: "Event Management", showOnHome: false, sortOrder: 7 },
          { name: "Resort Management", showOnHome: false, sortOrder: 8 },
          { name: "Sustainable Tourism", showOnHome: false, sortOrder: 9 },
          { name: "Heritage & Cultural Tourism", showOnHome: false, sortOrder: 10 },
          { name: "Destination Management", showOnHome: false, sortOrder: 11 },
          { name: "Hospitality Operations", showOnHome: false, sortOrder: 12 },
          { name: "Tourism Economics", showOnHome: false, sortOrder: 13 },
        ],
      },
      {
        name: "Science",
        nameHi: "विज्ञान",
        icon: "flask",
        description: "Research across physics, chemistry, biology, environmental science and allied natural sciences.",
        sortOrder: 4,
        subtopics: [
          { name: "Physics", showOnHome: true, sortOrder: 1 },
          { name: "Chemistry", showOnHome: true, sortOrder: 2 },
          { name: "Mathematics", showOnHome: true, sortOrder: 3 },
          { name: "Biology", showOnHome: true, sortOrder: 4 },
          { name: "Biotechnology", showOnHome: true, sortOrder: 5 },
          { name: "Microbiology", showOnHome: false, sortOrder: 6 },
          { name: "Environmental Science", showOnHome: false, sortOrder: 7 },
          { name: "Life Sciences", showOnHome: false, sortOrder: 8 },
          { name: "Statistics", showOnHome: false, sortOrder: 9 },
          { name: "Earth Sciences", showOnHome: false, sortOrder: 10 },
          { name: "Materials Science", showOnHome: false, sortOrder: 11 },
        ],
      },
      {
        name: "Technology & Engineering",
        nameHi: "प्रौद्योगिकी एवं अभियांत्रिकी",
        icon: "cpu",
        description: "Research in computer science, AI, engineering disciplines, data science and emerging technologies.",
        sortOrder: 5,
        subtopics: [
          { name: "Computer Science", showOnHome: true, sortOrder: 1 },
          { name: "Information Technology", showOnHome: true, sortOrder: 2 },
          { name: "AI & Machine Learning", showOnHome: true, sortOrder: 3 },
          { name: "Data Science & Analytics", showOnHome: true, sortOrder: 4 },
          { name: "Electrical & Electronics Engineering", showOnHome: true, sortOrder: 5 },
          { name: "Mechanical Engineering", showOnHome: false, sortOrder: 6 },
          { name: "Civil Engineering", showOnHome: false, sortOrder: 7 },
          { name: "Chemical Engineering", showOnHome: false, sortOrder: 8 },
          { name: "Renewable Energy", showOnHome: false, sortOrder: 9 },
          { name: "Emerging Technologies", showOnHome: false, sortOrder: 10 },
        ],
      },
      {
        name: "Interdisciplinary Studies",
        nameHi: "अंतःविषय अध्ययन",
        icon: "layers",
        description: "Research that crosses traditional disciplinary boundaries, fostering innovative cross-domain inquiry.",
        sortOrder: 6,
        subtopics: [
          { name: "Interdisciplinary Research", showOnHome: false, sortOrder: 1 },
          { name: "Social Sciences", showOnHome: false, sortOrder: 2 },
          { name: "Public Policy", showOnHome: false, sortOrder: 3 },
          { name: "Gender Studies", showOnHome: false, sortOrder: 4 },
          { name: "Cultural Studies", showOnHome: false, sortOrder: 5 },
        ],
      },
    ];

    for (const area of areas) {
      const { subtopics, ...areaData } = area;
      const created = await prisma.researchArea.create({
        data: {
          ...areaData,
          subtopics: {
            create: subtopics,
          },
        },
      });
      console.log(`  ✅ Research area: ${created.name}`);
    }
  }

  // ─────────────────────────────────────────────
  // 7. ISSUE
  // ─────────────────────────────────────────────
  const existingIssue = await prisma.issue.count();
  if (existingIssue === 0) {
    const issue = await prisma.issue.create({
      data: {
        volume: 1,
        issueNo: 1,
        month: 10,
        year: 2026,
        title: "Inaugural Issue",
        status: IssueStatus.FORTHCOMING,
        submissionDeadline: new Date("2026-10-31"),
        editorialNote:
          "We are delighted to announce the inaugural issue of the Journal of Interdisciplinary Innovation & Research (JIIR). We invite researchers from all disciplines to contribute original work to this foundational issue.",
      },
    });
    console.log(`✅ Issue seeded: Vol. ${issue.volume}, Issue ${issue.issueNo}`);
  }

  // ─────────────────────────────────────────────
  // 8. CALL FOR PAPERS
  // ─────────────────────────────────────────────
  const existingCfp = await prisma.callForPapers.count();
  if (existingCfp === 0) {
    await prisma.callForPapers.create({
      data: {
        title: "Call for Papers — Volume 1, Issue 1 (October 2026)",
        titleHi: "पेपर आमंत्रण — खंड 1, अंक 1 (अक्टूबर 2026)",
        body: `The Journal of Interdisciplinary Innovation & Research (JIIR) invites original research manuscripts for its inaugural issue (Volume 1, Issue 1, October 2026).

JIIR is a peer-reviewed academic journal dedicated to advancing knowledge across disciplines including management and business, education, hospitality and tourism, science, and technology and engineering.

**Submission Categories**
- Research Articles
- Review Articles
- Case Studies
- Short Communications

**Language**
Submissions are accepted in English and Hindi.

**Peer Review**
All submissions undergo double-blind peer review by subject experts.

**Article Processing Charge (APC)**
APC is payable only after acceptance and a formal fee request from the editorial office. The APC does not influence the editorial decision.

**Submission**
Authors must register as scholars on the JIIR platform and submit through the online submission portal.`,
        bodyHi: "",
        deadline: new Date("2026-10-31"),
        categories: ["Research Article", "Review Article", "Case Study", "Short Communication"],
        themes: [
          "Management & Business Innovation",
          "Transformations in Education",
          "Sustainable Hospitality & Tourism",
          "Applied Sciences",
          "Technology & Engineering Solutions",
          "Interdisciplinary Approaches",
        ],
        isActive: true,
      },
    });
    console.log("✅ Call for Papers seeded");
  }

  // ─────────────────────────────────────────────
  // 9. INDEXING SERVICES
  // ─────────────────────────────────────────────
  const existingIndexing = await prisma.indexingService.count();
  if (existingIndexing === 0) {
    await prisma.indexingService.createMany({
      data: [
        { name: "Crossref", category: "DOI & Citation", description: "DOI registration and metadata deposit with Crossref, the global DOI registration agency for scholarly content.", website: "https://www.crossref.org", status: IndexStatus.PLANNED, sortOrder: 1 },
        { name: "Google Scholar", category: "Academic Search", description: "Freely accessible web search engine indexing scholarly literature across formats and disciplines.", website: "https://scholar.google.com", status: IndexStatus.PLANNED, sortOrder: 2 },
        { name: "Academia.edu", category: "Academic Network", description: "Platform for academics to share research papers and track citations.", website: "https://www.academia.edu", status: IndexStatus.PLANNED, sortOrder: 3 },
        { name: "ResearchGate", category: "Academic Network", description: "Professional network for scientists and researchers to share and discover research.", website: "https://www.researchgate.net", status: IndexStatus.PLANNED, sortOrder: 4 },
        { name: "SSRN", category: "Repository", description: "Social Science Research Network — repository and distribution network for scholarly research.", website: "https://www.ssrn.com", status: IndexStatus.PLANNED, sortOrder: 5 },
        { name: "Semantic Scholar", category: "Academic Search", description: "AI-powered research tool for scientific literature from the Allen Institute for AI.", website: "https://www.semanticscholar.org", status: IndexStatus.PLANNED, sortOrder: 6 },
        { name: "Web of Science", category: "Citation Database", description: "Premier academic database covering multi-disciplinary research across thousands of peer-reviewed journals.", website: "https://www.webofscience.com", status: IndexStatus.PLANNED, sortOrder: 7 },
        { name: "WorldCat / OCLC", category: "Library Catalogue", description: "World's largest network of library content and services, aggregating library holdings globally.", website: "https://www.worldcat.org", status: IndexStatus.PLANNED, sortOrder: 8 },
        { name: "Mendeley", category: "Reference Manager", description: "Reference manager and academic social network with a central catalogue of research.", website: "https://www.mendeley.com", status: IndexStatus.PLANNED, sortOrder: 9 },
        { name: "OpenAlex", category: "Open Scholarly Graph", description: "Fully open and comprehensive catalogue of scholarly papers, authors, institutions and concepts.", website: "https://openalex.org", status: IndexStatus.PLANNED, sortOrder: 10 },
        { name: "EBSCO", category: "Discovery Service", description: "Leading provider of online research databases, e-journals, magazine subscriptions and e-books.", website: "https://www.ebsco.com", status: IndexStatus.PLANNED, sortOrder: 11 },
        { name: "Zenodo", category: "Repository", description: "Open-access research data repository built and developed by CERN.", website: "https://zenodo.org", status: IndexStatus.PLANNED, sortOrder: 12 },
        { name: "DOAJ", category: "Open Access Directory", description: "Directory of Open Access Journals — a community-curated online directory indexing open-access peer-reviewed journals.", website: "https://doaj.org", status: IndexStatus.PLANNED, sortOrder: 13 },
      ],
    });
    console.log("✅ Indexing services seeded (13 entries, all PLANNED)");
  }

  // ─────────────────────────────────────────────
  // 10. FAQS
  // ─────────────────────────────────────────────
  const existingFaqs = await prisma.faq.count();
  if (existingFaqs === 0) {
    await prisma.faq.createMany({
      data: [
        {
          category: "Submission",
          question: "How do I submit a manuscript to JIIR?",
          answer: "Register as a scholar on the JIIR website, verify your email address, complete your profile, and then use the Submit Manuscript button in your Scholar Panel. The online submission wizard will guide you through providing manuscript details, uploading your files, and completing the required declarations.",
          sortOrder: 1, showOnHome: true,
        },
        {
          category: "Submission",
          question: "What types of manuscripts does JIIR accept?",
          answer: "JIIR accepts Research Articles, Review Articles, Case Studies, and Short Communications across its covered disciplines: Management & Business, Education, Hospitality & Tourism, Science, Technology & Engineering, and Interdisciplinary Studies.",
          sortOrder: 2, showOnHome: false,
        },
        {
          category: "Submission",
          question: "Can I submit a manuscript in Hindi?",
          answer: "Yes. JIIR accepts manuscripts written in both English and Hindi. Please indicate the language of your manuscript during submission.",
          sortOrder: 3, showOnHome: false,
        },
        {
          category: "Tracking",
          question: "How do I track the status of my manuscript?",
          answer: "Use the Track Manuscript page and enter your Manuscript ID (e.g., JIIR-2026-0001) and the corresponding author's email address. You can also track your manuscript from your Scholar Panel after logging in.",
          sortOrder: 4, showOnHome: true,
        },
        {
          category: "Tracking",
          question: "What is a Manuscript ID / Paper ID?",
          answer: "Your Manuscript ID is a unique identifier assigned to your submission upon successful receipt (e.g., JIIR-2026-0001). It is sent to the corresponding author's email and displayed in your Scholar Panel. Please keep it confidential.",
          sortOrder: 5, showOnHome: false,
        },
        {
          category: "Peer Review",
          question: "What happens after I submit my manuscript?",
          answer: "After submission, your manuscript undergoes an initial editorial check for scope and formatting. Suitable manuscripts are sent for peer review by subject experts. Based on reviewer feedback, the Chief Editor makes a final decision: accept, request revision, or reject.",
          sortOrder: 6, showOnHome: true,
        },
        {
          category: "Peer Review",
          question: "How does the peer review process work at JIIR?",
          answer: "JIIR follows a rigorous peer-review process. Manuscripts that pass the initial editorial screening are assigned to independent expert reviewers. Each reviewer evaluates the manuscript for originality, methodology, clarity, and scholarly contribution, and submits a recommendation to the editor.",
          sortOrder: 7, showOnHome: false,
        },
        {
          category: "APC & Payment",
          question: "When is the Article Processing Charge (APC) payable?",
          answer: "The APC is payable only after your manuscript has been accepted for publication and you have received an official fee request from the editorial office. You will never be asked to pay before acceptance. The APC does not influence the editorial decision in any way.",
          sortOrder: 8, showOnHome: true,
        },
        {
          category: "APC & Payment",
          question: "What is the APC for JIIR?",
          answer: "For Indian corresponding authors: ₹800 (without DOI) or ₹1,000 (with DOI option). For international corresponding authors: USD 40 (without DOI) or USD 50 (with DOI option). The DOI option includes up to 30 pages; additional pages may be charged separately. Fees are reviewed periodically and the latest schedule is always on the Article Processing Charges page.",
          sortOrder: 9, showOnHome: false,
        },
        {
          category: "APC & Payment",
          question: "How can I pay the publication fee?",
          answer: "You can pay online using the secure Razorpay payment gateway (accepts UPI, net banking, debit/credit cards, wallets). Alternatively, you may submit payment via bank transfer and record the transaction details in your Scholar Panel for staff verification.",
          sortOrder: 10, showOnHome: false,
        },
        {
          category: "DOI",
          question: "Does JIIR assign DOIs to published articles?",
          answer: "DOI assignment is a planned service for JIIR. Authors who choose the 'With DOI' publication option at the time of submission will be eligible for DOI registration. DOIs will only be assigned once the journal has completed registration with Crossref. The current DOI registration status is available on the DOI Information page.",
          sortOrder: 11, showOnHome: false,
        },
        {
          category: "Withdrawal",
          question: "Can I withdraw my manuscript?",
          answer: "Yes. You may request withdrawal of your manuscript before it has been published. Log in to your Scholar Panel, open your manuscript, and submit a withdrawal request with a reason. Staff will review your request. Please note that manuscripts already accepted and for which payment has been processed may be subject to the Refund & Cancellation Policy.",
          sortOrder: 12, showOnHome: false,
        },
        {
          category: "Certificates",
          question: "How do I get my acceptance or publication certificate?",
          answer: "Certificates are automatically generated and issued to the corresponding author's email at the time of acceptance and again at publication. They are also downloadable from your Scholar Panel and the Track Manuscript page using your Manuscript ID.",
          sortOrder: 13, showOnHome: false,
        },
        {
          category: "Contact",
          question: "How do I contact the editorial office?",
          answer: "You can reach the editorial office through the Contact Us page, by email, or by WhatsApp. Response times are typically within 2–3 working days.",
          sortOrder: 14, showOnHome: false,
        },
        {
          category: "Submission",
          question: "How long will my article remain available online after publication?",
          answer: "Published articles in JIIR are intended to remain permanently available through the journal's archive. JIIR is committed to long-term preservation of published scholarship.",
          sortOrder: 15, showOnHome: false,
        },
        {
          category: "Submission",
          question: "Can I submit more than one article at a time?",
          answer: "Yes. There is no restriction on the number of simultaneous submissions. However, each submission must be for an original, unpublished manuscript not under consideration elsewhere.",
          sortOrder: 16, showOnHome: false,
        },
      ],
    });
    console.log("✅ FAQs seeded (16 entries)");
  }

  // ─────────────────────────────────────────────
  // 11. RESOURCES
  // ─────────────────────────────────────────────
  const existingResources = await prisma.resource.count();
  if (existingResources === 0) {
    await prisma.resource.createMany({
      data: [
        { title: "Manuscript Template (Word)", description: "Official JIIR manuscript template in Microsoft Word format.", version: "1.0", category: "TEMPLATE", sortOrder: 1 },
        { title: "Author Guidelines (PDF)", description: "Detailed author guidelines covering all aspects of manuscript preparation and submission.", version: "1.0", category: "GUIDELINES", sortOrder: 2 },
        { title: "Citation Style Guide (PDF)", description: "JIIR citation and reference formatting guide (APA 7th edition recommended).", version: "1.0", category: "CITATION", sortOrder: 3 },
        { title: "Copyright Transfer Form", description: "Author copyright transfer/licence form to be submitted with the final accepted manuscript.", version: "1.0", category: "FORM", sortOrder: 4 },
        { title: "Plagiarism Declaration Form", description: "Declaration of originality and plagiarism undertaking for corresponding authors.", version: "1.0", category: "FORM", sortOrder: 5 },
        { title: "Conflict of Interest Disclosure Form", description: "Form for disclosing potential conflicts of interest.", version: "1.0", category: "FORM", sortOrder: 6 },
      ],
    });
    console.log("✅ Resources seeded");
  }

  // ─────────────────────────────────────────────
  // 12. PAGES
  // ─────────────────────────────────────────────
  const existingPages = await prisma.page.count();
  if (existingPages === 0) {
    const pages = [
      {
        slug: "about",
        title: "About JIIR",
        subtitle: "Our story, mission, and commitment to interdisciplinary scholarship",
        blocks: [
          { type: "richText", content: "<h2>About the Journal</h2><p>The <strong>Journal of Interdisciplinary Innovation &amp; Research (JIIR)</strong> is a peer-reviewed academic journal dedicated to fostering original scholarship that crosses traditional disciplinary boundaries. Established with the conviction that the most transformative discoveries emerge at the intersections of disciplines, JIIR brings together researchers from management, education, hospitality, science, technology, and beyond.</p><p>JIIR provides a rigorous, transparent, and author-friendly platform for scholars to share their work with a global academic community. The journal is committed to the highest standards of peer review, publication ethics, and research integrity.</p>" },
          { type: "richText", content: "<h2>Aims &amp; Scope</h2><p>JIIR publishes original research, review articles, case studies, and short communications across five primary disciplines and their intersections:</p><ul><li><strong>Management &amp; Business</strong> — business management, HRM, marketing, finance, entrepreneurship, and commerce</li><li><strong>Education</strong> — pedagogy, educational technology, higher education, NEP, and inclusive education</li><li><strong>Hospitality, Tourism &amp; Hotel Management</strong> — hotel operations, tourism, event management, and sustainable travel</li><li><strong>Science</strong> — physics, chemistry, biology, environmental science, and allied sciences</li><li><strong>Technology &amp; Engineering</strong> — computer science, AI, data science, engineering disciplines, and emerging technologies</li></ul>" },
          { type: "richText", content: "<h2>Publisher</h2><p>JIIR is published by JIIR Publications. The journal accepts manuscripts in English and Hindi and is published on a monthly basis.</p>" },
        ],
        seoTitle: "About JIIR — Journal of Interdisciplinary Innovation & Research",
        seoDescription: "Learn about JIIR, its mission, vision, aims and scope, and its commitment to advancing interdisciplinary scholarship.",
      },
      {
        slug: "aims-scope",
        title: "Aims & Scope",
        subtitle: "The disciplines and research areas covered by JIIR",
        blocks: [
          { type: "richText", content: "<h2>Aims of JIIR</h2><p>The Journal of Interdisciplinary Innovation &amp; Research (JIIR) aims to:</p><ul><li>Provide a high-quality, peer-reviewed platform for original academic research across multiple disciplines</li><li>Encourage and celebrate interdisciplinary inquiry that generates new knowledge at the boundaries of established fields</li><li>Support researchers from India and internationally in disseminating their scholarship to a global audience</li><li>Maintain the highest standards of research integrity, publication ethics, and peer-review transparency</li><li>Foster an inclusive, ethical, and author-friendly publication environment</li></ul>" },
          { type: "richText", content: "<h2>Scope</h2><p>JIIR welcomes submissions in the following primary subject areas and their intersections. This list is indicative and not exhaustive; genuinely interdisciplinary work is especially encouraged.</p><p><strong>Management &amp; Business:</strong> Business Management, HRM, Marketing, Financial Management, Strategic Management, Entrepreneurship, International Business, Organisational Behaviour, Operations Management, Banking &amp; Finance, Commerce, Supply Chain &amp; Logistics.</p><p><strong>Education:</strong> Education &amp; Pedagogy, Educational Technology, Teacher Education, Higher Education, Educational Psychology, Curriculum &amp; Instruction, Educational Administration, Distance &amp; Online Education, Inclusive Education, Educational Policy &amp; NEP, Vocational &amp; Skill Education.</p><p><strong>Hospitality, Tourism &amp; Hotel Management:</strong> Hospitality Management, Hotel Management, Tourism Management, Travel &amp; Tourism, Food &amp; Beverage Management, Hospitality Marketing, Event Management, Resort Management, Sustainable Tourism, Heritage &amp; Cultural Tourism, Destination Management.</p><p><strong>Science:</strong> Physics, Chemistry, Mathematics, Biology, Biotechnology, Microbiology, Environmental Science, Life Sciences, Statistics, Earth Sciences, Materials Science.</p><p><strong>Technology &amp; Engineering:</strong> Computer Science, Information Technology, AI &amp; Machine Learning, Data Science &amp; Analytics, Electrical &amp; Electronics Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, Renewable Energy, Emerging Technologies.</p><p><strong>Interdisciplinary Studies:</strong> Research that bridges two or more of the above areas or addresses cross-cutting themes including social sciences, public policy, gender studies, and cultural studies.</p>" },
          { type: "richText", content: "<h2>Article Types</h2><p>JIIR publishes the following article types:</p><ul><li><strong>Research Articles</strong> — original empirical or theoretical research</li><li><strong>Review Articles</strong> — comprehensive literature reviews synthesising existing knowledge</li><li><strong>Case Studies</strong> — in-depth analysis of specific instances or scenarios</li><li><strong>Short Communications</strong> — concise reports of significant findings</li></ul>" },
        ],
        seoTitle: "Aims & Scope — JIIR",
        seoDescription: "JIIR publishes original research in management, education, hospitality, science, technology and interdisciplinary fields. See the full scope.",
      },
      {
        slug: "author-guidelines",
        title: "Author Guidelines",
        subtitle: "Everything you need to prepare and submit your manuscript",
        blocks: [
          { type: "richText", content: "<h2>Manuscript Preparation</h2><p>Authors are advised to carefully read these guidelines before preparing their manuscript. Manuscripts that do not conform to these guidelines may be returned without review.</p><h3>Manuscript Types</h3><p>JIIR accepts Research Articles, Review Articles, Case Studies, and Short Communications. The manuscript type must be clearly indicated at submission.</p><h3>Language</h3><p>Manuscripts may be submitted in English or Hindi. Authors submitting in Hindi are encouraged to provide an English abstract.</p>" },
          { type: "richText", content: "<h3>Title</h3><p>The title should be concise, specific, and informative, avoiding abbreviations. A running title of up to 50 characters may also be provided.</p><h3>Abstract</h3><p>Provide an abstract of 150–300 words summarising the objective, methodology, results, and conclusions of the study. The abstract should be self-contained and not contain undefined abbreviations or references.</p><h3>Keywords</h3><p>Provide 4–8 keywords reflecting the key themes of the manuscript, separated by semicolons.</p>" },
          { type: "richText", content: "<h3>Formatting</h3><p>Use the JIIR manuscript template where possible. Recommended formatting: single column, 12-point Times New Roman or Arial, 1.5 line spacing, 1-inch (2.54 cm) margins on all sides. Number all pages. Figures and tables should be embedded in the text at the relevant location.</p><h3>References &amp; Citations</h3><p>APA 7th edition is the recommended citation style. Ensure that all in-text citations have a corresponding entry in the reference list and vice versa. Do not include unpublished or non-retrievable sources unless clearly indicated.</p>" },
          { type: "richText", content: "<h3>Declarations</h3><p>Authors must declare: (a) all authors have approved the manuscript, (b) the work is original and not under consideration elsewhere, (c) conflicts of interest, funding sources, and ethics approvals are disclosed, and (d) the use of AI or automated tools in preparing the manuscript.</p><h3>Plagiarism &amp; Originality</h3><p>Submissions must be original and free from plagiarism. JIIR uses plagiarism detection tools as part of the review process. A similarity of up to 15% (excluding references) is generally acceptable; higher similarity rates may lead to rejection or revision request.</p>" },
          { type: "richText", content: "<h2>Submission Process</h2><p>Manuscripts must be submitted through the JIIR online portal. Email submissions are not accepted. The corresponding author must be registered as a Scholar and have a verified account. Please ensure the manuscript file is in PDF or Microsoft Word format.</p><h2>Revision Procedure</h2><p>When revision is requested, authors should submit the revised manuscript along with a detailed Response to Reviewers document addressing each reviewer comment. The revised manuscript should have tracked changes enabled.</p>" },
        ],
        seoTitle: "Author Guidelines — JIIR",
        seoDescription: "Detailed guidelines for preparing and submitting manuscripts to JIIR, including formatting, references, declarations and submission process.",
      },
      {
        slug: "publication-ethics",
        title: "Publication Ethics",
        subtitle: "Our standards for ethical research and responsible publishing",
        blocks: [
          { type: "richText", content: "<h2>Editorial Standards</h2><p>JIIR is committed to upholding the highest standards of ethical publishing. The journal follows the principles of the Committee on Publication Ethics (COPE) and expects all authors, reviewers, and editors to conduct themselves accordingly.</p><h2>Authors' Responsibilities</h2><p>Authors must ensure that: all listed authors have made a genuine intellectual contribution; the work is original and not published or under review elsewhere; data and results are accurately reported; conflicts of interest, funding sources, and ethics approvals are fully disclosed; the manuscript does not contain plagiarised content; and the use of AI writing tools is disclosed.</p>" },
          { type: "richText", content: "<h2>Reviewers' Responsibilities</h2><p>Reviewers must: treat manuscripts as confidential; provide objective, constructive, and timely reviews; disclose conflicts of interest and decline to review manuscripts where conflicts exist; not use manuscript content for personal advantage; and recommend withdrawal if they suspect research misconduct.</p><h2>Editors' Responsibilities</h2><p>Editors must: make fair, unbiased decisions based solely on scholarly merit; maintain confidentiality of submitted manuscripts; manage conflicts of interest; and act on reports of research misconduct in accordance with COPE guidelines.</p>" },
          { type: "richText", content: "<h2>Plagiarism</h2><p>JIIR regards plagiarism — the use of another's words, ideas, or data without proper attribution — as a serious breach of ethics. Manuscripts identified as plagiarised will be rejected. If plagiarism is discovered after publication, the article will be retracted.</p><h2>Duplicate Submission</h2><p>Submission of a manuscript to more than one journal simultaneously constitutes duplicate submission and is not acceptable. Authors who have published earlier versions (preprints, conference papers) should declare this at submission.</p><h2>Data Fabrication &amp; Falsification</h2><p>JIIR takes data fabrication and falsification extremely seriously. Any confirmed instance will result in immediate rejection or retraction, and may be reported to the author's institution.</p>" },
          { type: "richText", content: "<h2>Authorship</h2><p>All listed authors must have made a genuine and substantial intellectual contribution to the work. Honorary, guest, or ghost authorship is not acceptable. Changes to authorship after submission must be approved by all authors and the editorial office.</p><h2>AI Tools Disclosure</h2><p>Authors who have used AI tools (e.g., large language models) in preparing any part of the manuscript must clearly disclose this in the Methods or Acknowledgements section. AI tools may not be listed as authors.</p><h2>Corrections &amp; Retractions</h2><p>JIIR is committed to correcting the scholarly record when errors are identified. Corrections are published for significant errors that affect the interpretation or reliability of results. Retractions are issued for articles with major flaws that undermine the conclusions, or for confirmed misconduct. Expressions of concern may be issued while an investigation is ongoing.</p>" },
        ],
        seoTitle: "Publication Ethics — JIIR",
        seoDescription: "JIIR publication ethics policy covering authorship, plagiarism, data integrity, peer review, and corrections and retractions.",
      },
      {
        slug: "peer-review-policy",
        title: "Peer Review Policy",
        subtitle: "Our commitment to rigorous and fair scholarly evaluation",
        blocks: [
          { type: "richText", content: "<h2>Review Model</h2><p>The peer review model adopted by JIIR will be confirmed by the editorial board and published here. Until confirmed, the review model is described as: to be announced. Authors are advised to prepare their manuscripts without identifying information in the main text to support any blinded review model.</p><h2>Initial Editorial Screening</h2><p>All submissions undergo an initial editorial check before peer review. This screening assesses whether the manuscript falls within JIIR's scope, meets minimum formatting standards, and contains no obvious ethical issues. Manuscripts that do not pass this check will be returned to the authors without external review.</p>" },
          { type: "richText", content: "<h2>Reviewer Selection</h2><p>Reviewers are selected based on their subject expertise and availability. At least two independent expert reviewers are assigned to each manuscript. Authors may suggest potential reviewers or request the exclusion of specific individuals, which the editor will take into consideration but is not bound to follow.</p><h2>Review Process</h2><p>Reviewers evaluate manuscripts on originality, methodological rigour, clarity of presentation, scholarly contribution, and adherence to ethical standards. Reviewers submit a structured assessment form and a recommendation (Accept, Minor Revision, Major Revision, or Reject) within the specified deadline.</p>" },
          { type: "richText", content: "<h2>Confidentiality</h2><p>Peer review at JIIR is confidential. Reviewers must not share, discuss, or use manuscript content for personal advantage. Reviewer identities are protected.</p><h2>Author Revisions</h2><p>When revision is requested, authors receive reviewer comments and are given a specified deadline to submit the revised manuscript and a Response to Reviewers. Revised manuscripts may undergo further review at the editor's discretion.</p><h2>Editorial Decision</h2><p>The final editorial decision is made by the Chief Editor (or Super Admin) based on reviewer recommendations and editorial judgment. The decision options are: Accept, Request Revision, or Reject. The Chief Editor's decision is final, but authors may submit a formal appeal to the editorial office if they believe there has been a procedural error.</p>" },
        ],
        seoTitle: "Peer Review Policy — JIIR",
        seoDescription: "JIIR peer review policy: initial screening, reviewer selection, review process, confidentiality, revisions, and editorial decisions.",
      },
      {
        slug: "privacy",
        title: "Privacy Policy",
        subtitle: "How we collect, use, and protect your personal information",
        blocks: [
          { type: "richText", content: "<p><em>This is a draft privacy policy — please review with legal counsel before publishing. Last reviewed: October 2026.</em></p><h2>1. Introduction</h2><p>The Journal of Interdisciplinary Innovation &amp; Research (JIIR), published by JIIR Publications, is committed to protecting the privacy of our authors, reviewers, readers, and all visitors to our platform. This Privacy Policy explains what personal data we collect, how we use it, and your rights in relation to it.</p><h2>2. Data We Collect</h2><p>We may collect: name and contact details (email, phone) when you register or submit an enquiry; manuscript submission details; payment information (processed securely by Razorpay — we do not store card details); usage data (pages visited, browser type) via analytics tools; and cookies for session management.</p>" },
          { type: "richText", content: "<h2>3. How We Use Your Data</h2><p>We use personal data to: process manuscript submissions and manage the review workflow; communicate with authors, reviewers, and editors regarding submissions; process publication fee payments; send essential service notifications (submission confirmations, status updates, certificates); respond to enquiries; and improve the journal platform.</p><h2>4. Data Sharing</h2><p>We do not sell or rent your personal data. We share data only with: payment processors (Razorpay) for fee transactions; email service providers for transactional emails; and Cloudinary for secure file storage. All third-party processors are required to maintain appropriate security standards.</p><h2>5. Cookies</h2><p>We use essential cookies for user authentication sessions and optional analytics cookies. You may decline non-essential cookies through the cookie consent banner.</p>" },
          { type: "richText", content: "<h2>6. Data Retention</h2><p>We retain account and manuscript data for as long as necessary to fulfil the purposes for which it was collected, to comply with legal obligations, and to maintain the scholarly record. Published article metadata is retained indefinitely as part of the permanent scholarly record.</p><h2>7. Your Rights</h2><p>Subject to applicable law (including the Information Technology Act, 2000 and associated rules for users in India, and the GDPR for users in the European Economic Area), you have the right to: access your personal data; correct inaccurate data; request deletion of data (subject to our archiving obligations); object to processing; and data portability. To exercise these rights, please contact: editor@jiir.in.</p><h2>8. Contact</h2><p>For privacy-related queries, please contact our editorial office at editor@jiir.in.</p>" },
        ],
        seoTitle: "Privacy Policy — JIIR",
        seoDescription: "JIIR privacy policy: how we collect, use, and protect your personal information as an author, reviewer, or reader.",
      },
      {
        slug: "terms",
        title: "Terms of Use",
        subtitle: "Terms and conditions for using the JIIR platform",
        blocks: [
          { type: "richText", content: "<p><em>This is a draft Terms of Use — please review with legal counsel before publishing. Last reviewed: October 2026.</em></p><h2>1. Acceptance</h2><p>By accessing or using the JIIR website and platform (the 'Service'), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Service.</p><h2>2. Use of the Platform</h2><p>You agree to use the platform only for lawful purposes in connection with academic research and publication. You must not use the platform to: upload harmful, offensive, or misleading content; infringe the intellectual property rights of others; attempt to gain unauthorised access to any part of the platform; or engage in academic misconduct.</p>" },
          { type: "richText", content: "<h2>3. Author Accounts</h2><p>To submit manuscripts, you must register for a scholar account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. JIIR reserves the right to suspend or terminate accounts that violate these terms.</p><h2>4. Intellectual Property</h2><p>Authors retain copyright in their submitted works until a copyright transfer or licence agreement is executed. The JIIR platform, its design, and all platform-generated content (certificates, invoices, etc.) remain the intellectual property of JIIR Publications.</p><h2>5. Payments</h2><p>Payment transactions are processed by Razorpay in accordance with Razorpay's terms and privacy policy. JIIR does not store payment card data.</p>" },
          { type: "richText", content: "<h2>6. Disclaimer</h2><p>The content of published articles reflects the views of the authors and does not necessarily represent the views of the journal or its editorial board. JIIR makes reasonable efforts to ensure accuracy but does not warrant the completeness or fitness for a particular purpose of any content on the platform.</p><h2>7. Governing Law</h2><p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of [City], India.</p><h2>8. Changes</h2><p>JIIR may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated Terms.</p>" },
        ],
        seoTitle: "Terms of Use — JIIR",
        seoDescription: "Terms and conditions for using the JIIR journal platform, submitting manuscripts, and accessing published content.",
      },
      {
        slug: "copyright",
        title: "Copyright & Licensing",
        subtitle: "Author rights and content licensing at JIIR",
        blocks: [
          { type: "richText", content: "<p><em>This is a draft copyright and licensing policy — please review with legal counsel and confirm your open-access stance before publishing. Last reviewed: October 2026.</em></p><h2>Copyright</h2><p>Authors submitting manuscripts to JIIR retain copyright in their work. By submitting a manuscript, authors grant JIIR Publications a non-exclusive licence to publish, distribute, and archive the work in electronic and print formats.</p><h2>Licencing &amp; Access</h2><p>The licensing model and open-access policy for JIIR content is to be announced. Authors will be informed of the applicable licence before publication. JIIR is committed to providing broad access to scholarly content within a sustainable publishing model.</p>" },
          { type: "richText", content: "<h2>Reproduction &amp; Reuse</h2><p>Readers wishing to reproduce, adapt, or distribute JIIR content beyond what is permitted by applicable copyright law should contact the editorial office at editor@jiir.in to request permission.</p><h2>Self-Archiving</h2><p>Authors' self-archiving rights will be specified in the copyright transfer or licence agreement executed at the time of publication. Please contact the editorial office for guidance on self-archiving prior to confirmation of the journal's policy.</p>" },
        ],
        seoTitle: "Copyright & Licensing — JIIR",
        seoDescription: "JIIR copyright and licensing policy for authors, including author rights, content licensing, and reproduction permissions.",
      },
      {
        slug: "refund-policy",
        title: "Refund & Cancellation Policy",
        subtitle: "Our policy on Article Processing Charge refunds",
        blocks: [
          { type: "richText", content: "<p><em>This is a draft refund policy — please review with legal counsel and align with Razorpay's requirements before publishing. Last reviewed: October 2026.</em></p><h2>Article Processing Charge Refund Policy</h2><p>The Article Processing Charge (APC) is payable only after a manuscript has been accepted for publication and the corresponding author has received an official fee request from the editorial office. The APC is non-refundable once the manuscript has entered the production and typesetting stage.</p><h2>Eligibility for Refunds</h2><p>A full refund of the APC may be granted if:</p><ul><li>The manuscript is withdrawn by the author before production begins</li><li>The manuscript is rejected after payment due to an editorial error</li><li>A duplicate payment is made</li></ul><p>Refunds will not be granted once production has commenced, or if the withdrawal is requested after the article has been published.</p>" },
          { type: "richText", content: "<h2>Refund Process</h2><p>To request a refund, please contact the editorial office at editor@jiir.in with your Manuscript ID and payment reference. Refund requests will be reviewed within 7 working days. Approved refunds will be processed to the original payment method within 10–15 working days, subject to Razorpay's processing timelines.</p><h2>Cancellation</h2><p>Manuscript submissions may be withdrawn (cancelled) at any stage prior to publication. Withdrawal after acceptance may incur a processing fee if production work has commenced. Please refer to the Author Guidelines for withdrawal procedures.</p><h2>Contact</h2><p>For payment and refund queries, please contact: editor@jiir.in or use the Contact Us page.</p>" },
        ],
        seoTitle: "Refund & Cancellation Policy — JIIR",
        seoDescription: "JIIR refund and cancellation policy for Article Processing Charges (APC), withdrawal, and duplicate payments.",
      },
      {
        slug: "publication-procedure",
        title: "Publication Procedure",
        subtitle: "Step-by-step guide from submission to online publication",
        blocks: [
          { type: "richText", content: "<h2>Publication Procedure</h2><p>The following steps describe the complete publication journey from manuscript submission to online publication in JIIR.</p><ol><li><strong>Manuscript Submission</strong> — The corresponding author submits the manuscript through the JIIR online portal with all required details, files, and declarations.</li><li><strong>Initial Editorial Screening</strong> — The editorial team checks the manuscript for scope, formatting, completeness, and ethical compliance. Unsuitable manuscripts are returned at this stage.</li><li><strong>Peer Review</strong> — Suitable manuscripts are sent to at least two independent expert reviewers. Reviewers submit a structured evaluation and recommendation.</li><li><strong>Revision (if required)</strong> — Authors may be requested to revise their manuscript based on reviewer feedback. Revised manuscripts are resubmitted and may undergo further review.</li><li><strong>Final Editorial Decision</strong> — The Chief Editor makes the final decision: Accept, Request Revision, or Reject.</li><li><strong>Acceptance Notification</strong> — Accepted authors receive an acceptance notification and an Acceptance Certificate.</li><li><strong>Article Processing Charge</strong> — An APC fee request is issued to the corresponding author after acceptance (payment does not influence the editorial decision).</li><li><strong>Copyediting &amp; Typesetting</strong> — After payment verification, the manuscript undergoes professional copyediting and typesetting.</li><li><strong>Author Proof</strong> — The typeset proof is sent to the corresponding author for review and approval.</li><li><strong>DOI Registration</strong> — Where the DOI option has been selected and registration is active, a DOI is assigned.</li><li><strong>Online Publication</strong> — The article is published online and added to the JIIR archive.</li><li><strong>Current Issue &amp; Archive</strong> — Published articles appear in the Current Issue and are permanently archived in Past Issues.</li></ol>" },
        ],
        seoTitle: "Publication Procedure — JIIR",
        seoDescription: "Step-by-step publication procedure at JIIR from manuscript submission through peer review, acceptance, payment, typesetting, to online publication.",
      },
      {
        slug: "journal-information",
        title: "Journal Information",
        subtitle: "Key facts about the Journal of Interdisciplinary Innovation & Research",
        blocks: [
          { type: "richText", content: "<h2>Journal Details</h2><p>All information below is maintained by the editorial office and updated as necessary.</p>" },
        ],
        seoTitle: "Journal Information — JIIR",
        seoDescription: "Key facts about JIIR: journal type, publisher, frequency, languages, subjects, ISSN, open access, and contact.",
      },
      {
        slug: "doi",
        title: "DOI Information",
        subtitle: "Digital Object Identifiers at JIIR",
        blocks: [
          { type: "richText", content: "<h2>What is a DOI?</h2><p>A Digital Object Identifier (DOI) is a persistent, internationally recognised identifier assigned to scholarly content. A DOI links permanently to the online version of an article, even if the URL changes. DOIs are managed by Crossref, the official DOI registration agency for scholarly publishing.</p><h2>DOI at JIIR</h2><p>DOI registration is a planned service for JIIR. Authors who select the 'With DOI' publication option at submission will be eligible for a DOI once the journal has completed its registration with Crossref. The current status is: <strong>PLANNED — not yet active.</strong></p><p>DOIs will be displayed on published articles only when they have actually been registered. No DOI claim will be made before registration is confirmed.</p><h2>Where to Find Your DOI</h2><p>Once assigned, your article's DOI will appear on its article page, in the journal archive, and in the downloadable citation formats. DOIs take the form https://doi.org/10.XXXXX/JIIR.XXXX.</p>" },
        ],
        seoTitle: "DOI Information — JIIR",
        seoDescription: "Information about DOI registration at JIIR, what DOIs are, the current registration status, and the DOI option for authors.",
      },
      {
        slug: "institutional-membership",
        title: "Institutional Membership",
        subtitle: "Partnership opportunities for universities, colleges and research institutions",
        blocks: [
          { type: "richText", content: "<h2>Institutional Membership</h2><p>JIIR is developing an institutional membership programme for universities, colleges, and research institutions. Institutional membership will offer a range of benefits including facilitated access for faculty and researchers, collaborative publication opportunities, and engagement with the JIIR editorial community.</p><p>Details of the institutional membership programme, including fee structures and benefits, will be announced when confirmed. We invite expressions of interest from institutions in advance of the formal launch.</p><p>To express interest in institutional membership, please contact us using the enquiry form below.</p>" },
          { type: "callout", content: "Interested in institutional membership? Contact our editorial office to discuss how JIIR can support your institution's research publication needs.", linkLabel: "Submit an Enquiry", linkUrl: "/contact?topic=Institutional" },
        ],
        seoTitle: "Institutional Membership — JIIR",
        seoDescription: "JIIR institutional membership for universities, colleges and research institutions. Express interest in partnering with JIIR.",
      },
      {
        slug: "research-collaboration",
        title: "Research Collaboration",
        subtitle: "Collaborative research and editorial opportunities",
        blocks: [
          { type: "richText", content: "<h2>Research Collaboration</h2><p>JIIR welcomes collaborative research and editorial partnerships with academic institutions, research centres, and professional bodies. Collaboration may take the form of special issues on specific themes, co-authored editorial projects, or guest editor arrangements.</p><p>Collaborative proposals are assessed on their academic merit, alignment with JIIR's scope, and the editorial independence of the journal. JIIR maintains full editorial independence in all collaborative arrangements.</p><p>Collaboration proposals should be submitted in writing to the editorial office outlining the proposed topic, contributing parties, and timeline.</p>" },
          { type: "callout", content: "Have a research collaboration idea? We'd love to hear from you.", linkLabel: "Contact the Editorial Office", linkUrl: "/contact?topic=Institutional" },
        ],
        seoTitle: "Research Collaboration — JIIR",
        seoDescription: "JIIR research collaboration opportunities for institutions, including special issues and guest editorial arrangements.",
      },
      {
        slug: "conference-collaboration",
        title: "Conference Collaboration",
        subtitle: "Partnering with JIIR for your academic conference",
        blocks: [
          { type: "richText", content: "<h2>Conference Collaboration</h2><p>JIIR is open to conference collaboration arrangements, including the publication of selected conference papers in special issues, proceedings partnerships, and journal sponsorships of academic events.</p><p>Conference collaboration proposals should include: details of the organising institution and conference theme; the proposed scope and subject area; estimated number of submissions; timeline; and the nature of the collaboration sought.</p><p>All proposals are subject to editorial review to ensure alignment with JIIR's scope and standards. Full editorial independence is maintained in any collaborative arrangement.</p>" },
          { type: "callout", content: "Organising a conference and looking for a publication partner?", linkLabel: "Submit a Collaboration Enquiry", linkUrl: "/contact?topic=Conference" },
        ],
        seoTitle: "Conference Collaboration — JIIR",
        seoDescription: "Partner with JIIR for your academic conference through publication partnerships, special issues, or proceedings collaboration.",
      },
      {
        slug: "institutional-services",
        title: "Institutional Publication Services",
        subtitle: "Services available to educational and research institutions",
        blocks: [
          { type: "richText", content: "<h2>Institutional Publication Services</h2><p>JIIR is developing a range of services for educational and research institutions, including support for faculty publication, institutional repository integration, and research output tracking.</p><p>These services are to be announced. Institutions are invited to submit expressions of interest and indicate their specific publication support requirements.</p><p>All services are governed by a formal written arrangement with the institution, with clear terms regarding editorial independence, costs, and deliverables.</p>" },
          { type: "callout", content: "Interested in institutional publication support services?", linkLabel: "Contact Us", linkUrl: "/contact?topic=Institutional" },
        ],
        seoTitle: "Institutional Publication Services — JIIR",
        seoDescription: "JIIR institutional publication services for universities and research institutions. Express interest in our services.",
      },
    ];

    for (const page of pages) {
      await prisma.page.upsert({
        where: { slug: page.slug },
        update: {},
        create: page,
      });
    }
    console.log(`✅ Pages seeded (${pages.length} pages)`);
  }

  // ─────────────────────────────────────────────
  // 13. HOME SECTIONS
  // ─────────────────────────────────────────────
  const existingHomeSections = await prisma.homeSection.count();
  if (existingHomeSections === 0) {
    const homeSections = [
      { key: "HERO", isVisible: true, sortOrder: 1, config: {
        eyebrow: "Management · Education · Science · Technology",
        headline: "Advancing Knowledge Across Disciplines",
        subheadline: "A peer-reviewed multidisciplinary research journal publishing original scholarship in management, education, hospitality, science, and technology.",
        cta1Label: "Submit Your Manuscript",
        cta1Href: "/submit-manuscript",
        cta2Label: "Track Manuscript",
        cta2Href: "/track-manuscript",
        trustLine: "Peer-reviewed · Monthly publication · English & Hindi · Open to all disciplines",
      }},
      { key: "JOURNAL_CARD", isVisible: true, sortOrder: 2 },
      { key: "ABOUT", isVisible: true, sortOrder: 3 },
      { key: "CURRENT_ISSUE", isVisible: true, sortOrder: 4 },
      { key: "CFP", isVisible: true, sortOrder: 5 },
      { key: "RESEARCH_AREAS", isVisible: true, sortOrder: 6 },
      { key: "ARTICLES", isVisible: true, sortOrder: 7 },
      { key: "PROCESS", isVisible: true, sortOrder: 8 },
      { key: "DOI_DISCOVERY", isVisible: true, sortOrder: 9 },
      { key: "TABS", isVisible: true, sortOrder: 10 },
      { key: "RESOURCES", isVisible: true, sortOrder: 11 },
      { key: "ANNOUNCEMENTS", isVisible: true, sortOrder: 12 },
      { key: "STATS", isVisible: false, sortOrder: 13, config: {
        stats: [
          { label: "Articles Published", value: 0 },
          { label: "Countries", value: 0 },
          { label: "Reviewers", value: 0 },
        ],
      }},
    ];

    for (const section of homeSections) {
      await prisma.homeSection.upsert({
        where: { key: section.key },
        update: {},
        create: section,
      });
    }
    console.log("✅ Home sections seeded");
  }

  // ─────────────────────────────────────────────
  // 14. CERTIFICATE TEMPLATES
  // ─────────────────────────────────────────────
  const existingTemplates = await prisma.certificateTemplate.count();
  if (existingTemplates === 0) {
    const certificateTypes = ["ACCEPTANCE", "PUBLICATION", "REVIEWER", "EDITORIAL_MEMBER", "PARTICIPATION"];
    for (const type of certificateTypes) {
      await prisma.certificateTemplate.upsert({
        where: { type },
        update: {},
        create: {
          type,
          signatoryName: "Editor-in-Chief",
          signatoryTitle: "Editor-in-Chief, JIIR",
          heading: `${type.replace("_", " ")} CERTIFICATE`,
          bodyTemplate:
            type === "ACCEPTANCE"
              ? "This is to certify that the manuscript titled <strong>{{manuscriptTitle}}</strong> submitted by <strong>{{recipientName}}</strong> has been accepted for publication in the <strong>Journal of Interdisciplinary Innovation &amp; Research (JIIR)</strong>."
              : type === "PUBLICATION"
              ? "This is to certify that the article titled <strong>{{manuscriptTitle}}</strong> authored by <strong>{{recipientName}}</strong> has been published in <strong>Volume {{volume}}, Issue {{issueNo}} ({{month}} {{year}})</strong> of the <strong>Journal of Interdisciplinary Innovation &amp; Research (JIIR)</strong>."
              : "This is to certify that <strong>{{recipientName}}</strong> has served as a valued reviewer for the <strong>Journal of Interdisciplinary Innovation &amp; Research (JIIR)</strong>.",
          footerNote: "This certificate is issued digitally and can be verified at " + (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + "/certificate-verify/{{verifyToken}}",
        },
      });
    }
    console.log("✅ Certificate templates seeded");
  }

  // ─────────────────────────────────────────────
  // 15. EMAIL TEMPLATES
  // ─────────────────────────────────────────────
  const existingEmailTemplates = await prisma.emailTemplate.count();
  if (existingEmailTemplates === 0) {
    await prisma.emailTemplate.createMany({
      data: [
        {
          key: "verify_email",
          subject: "Verify your email address — JIIR",
          htmlBody: `<p>Dear {{name}},</p><p>Thank you for registering with the Journal of Interdisciplinary Innovation &amp; Research (JIIR).</p><p>Please verify your email address by clicking the link below:</p><p><a href="{{verifyUrl}}">Verify Email Address</a></p><p>This link expires in 24 hours.</p><p>If you did not create a JIIR account, please ignore this email.</p>`,
        },
        {
          key: "reset_password",
          subject: "Reset your JIIR password",
          htmlBody: `<p>Dear {{name}},</p><p>We received a request to reset your JIIR account password.</p><p><a href="{{resetUrl}}">Reset Password</a></p><p>This link expires in 1 hour. If you did not request a password reset, please ignore this email.</p>`,
        },
        {
          key: "submission_received",
          subject: "Manuscript received — {{manuscriptCode}} | JIIR",
          htmlBody: `<p>Dear {{authorName}},</p><p>Thank you for submitting your manuscript to the Journal of Interdisciplinary Innovation &amp; Research (JIIR).</p><p><strong>Manuscript ID:</strong> {{manuscriptCode}}<br/><strong>Title:</strong> {{title}}</p><p>Your manuscript will now undergo an initial editorial check. You can track its status at any time using the Track Manuscript facility on our website or in your Scholar Panel.</p><p>Please keep your Manuscript ID confidential.</p>`,
        },
        {
          key: "status_change",
          subject: "Update on your manuscript {{manuscriptCode}} — JIIR",
          htmlBody: `<p>Dear {{authorName}},</p><p>The status of your manuscript has been updated.</p><p><strong>Manuscript ID:</strong> {{manuscriptCode}}<br/><strong>New Status:</strong> {{statusLabel}}</p><p>{{message}}</p><p>You can track your manuscript at: <a href="{{trackUrl}}">{{trackUrl}}</a></p>`,
        },
        {
          key: "accepted",
          subject: "Congratulations — Manuscript {{manuscriptCode}} Accepted | JIIR",
          htmlBody: `<p>Dear {{authorName}},</p><p>We are pleased to inform you that your manuscript has been accepted for publication in JIIR.</p><p><strong>Manuscript ID:</strong> {{manuscriptCode}}<br/><strong>Title:</strong> {{title}}</p><p>You will shortly receive a fee request for the Article Processing Charge (APC). Your Acceptance Certificate is available in your Scholar Panel.</p>`,
        },
        {
          key: "rejected",
          subject: "Decision on manuscript {{manuscriptCode}} — JIIR",
          htmlBody: `<p>Dear {{authorName}},</p><p>After careful consideration, we regret to inform you that your manuscript has not been accepted for publication in JIIR at this time.</p><p><strong>Manuscript ID:</strong> {{manuscriptCode}}</p><p>{{decisionNote}}</p><p>We thank you for your interest in JIIR and encourage you to consider submitting future work.</p>`,
        },
        {
          key: "fee_required",
          subject: "Publication Fee Request — {{manuscriptCode}} | JIIR",
          htmlBody: `<p>Dear {{authorName}},</p><p>Your manuscript has been accepted and the Article Processing Charge (APC) is now due.</p><p><strong>Amount:</strong> {{amount}}<br/><strong>Manuscript:</strong> {{manuscriptCode}}</p><p>Please pay via your Scholar Panel or the Pay Online page: <a href="{{payUrl}}">{{payUrl}}</a></p><p>Payment does not affect the editorial decision, which has already been made.</p>`,
        },
        {
          key: "payment_success",
          subject: "Payment Confirmed — {{manuscriptCode}} | JIIR",
          htmlBody: `<p>Dear {{authorName}},</p><p>We have received and verified your payment of {{amount}} for manuscript {{manuscriptCode}}.</p><p><strong>Invoice Number:</strong> {{invoiceNo}}<br/><strong>Payment ID:</strong> {{paymentId}}</p><p>Your manuscript will now proceed to production. Your invoice is available in your Scholar Panel.</p>`,
        },
        {
          key: "published",
          subject: "Your article is now published — JIIR",
          htmlBody: `<p>Dear {{authorName}},</p><p>We are delighted to inform you that your article has been published in JIIR!</p><p><strong>Title:</strong> {{title}}<br/><strong>Volume/Issue:</strong> {{volume}}/{{issueNo}}<br/><strong>Published:</strong> {{publishedDate}}</p><p>View your article: <a href="{{articleUrl}}">{{articleUrl}}</a></p><p>Your Publication Certificate is available in your Scholar Panel.</p>`,
        },
        {
          key: "enquiry_acknowledgement",
          subject: "We received your enquiry — JIIR",
          htmlBody: `<p>Dear {{name}},</p><p>Thank you for contacting the Journal of Interdisciplinary Innovation &amp; Research (JIIR). We have received your enquiry and will respond within 2–3 working days.</p><p><strong>Subject:</strong> {{subject}}</p>`,
        },
        {
          key: "account_blocked",
          subject: "Your JIIR account has been suspended",
          htmlBody: `<p>Dear {{name}},</p><p>Your JIIR account has been suspended. Reason: {{reason}}</p><p>If you believe this is an error, please contact our editorial office at editor@jiir.in.</p>`,
        },
      ],
    });
    console.log("✅ Email templates seeded (11 templates)");
  }

  console.log("\n🎉 JIIR database seeding complete!\n");
  console.log(`   Super Admin: ${adminEmail}`);
  console.log("   Next steps:");
  console.log("   1. Go to /admin → Site Settings → add logo, addresses, contact info");
  console.log("   2. Configure Razorpay keys in Settings");
  console.log("   3. Set up SMTP for email delivery");
  console.log("   4. Add editorial board members");
  console.log("   5. Create your first Call for Papers\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
