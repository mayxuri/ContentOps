// Dashboard KPI data
export const kpiData = [
  { label: 'Content Created', value: 1284, change: 12.5, period: 'vs last month' },
  { label: 'Compliance Rate', value: 98.7, suffix: '%', change: 2.1, period: 'vs last month' },
  { label: 'Languages Active', value: 14, change: 3, period: 'new this quarter' },
  { label: 'Channels Live', value: 8, change: 1, period: 'added this week' },
];

// Content output over time
export const contentOutputData = [
  { month: 'Sep', blogs: 42, social: 128, faqs: 18, emails: 34 },
  { month: 'Oct', blogs: 56, social: 145, faqs: 22, emails: 41 },
  { month: 'Nov', blogs: 61, social: 162, faqs: 28, emails: 52 },
  { month: 'Dec', blogs: 48, social: 134, faqs: 15, emails: 38 },
  { month: 'Jan', blogs: 72, social: 198, faqs: 32, emails: 58 },
  { month: 'Feb', blogs: 85, social: 224, faqs: 38, emails: 64 },
  { month: 'Mar', blogs: 94, social: 256, faqs: 41, emails: 71 },
];

// Recent pipeline activity
export const pipelineActivity = [
  { id: 1, agent: 'Content Drafter', action: 'Generated blog post for Q1 product launch', status: 'completed', time: '2 min ago', type: 'creation' },
  { id: 2, agent: 'Brand Reviewer', action: 'Approved social media campaign for FinanceFlow', status: 'completed', time: '5 min ago', type: 'review' },
  { id: 3, agent: 'Compliance Officer', action: 'Flagged health claim in NutriTrack blog draft', status: 'flagged', time: '8 min ago', type: 'compliance' },
  { id: 4, agent: 'Localizer', action: 'Translated product launch assets to Spanish and French', status: 'completed', time: '12 min ago', type: 'localization' },
  { id: 5, agent: 'Publisher', action: 'Scheduled Instagram carousel for CloudSync launch', status: 'scheduled', time: '15 min ago', type: 'distribution' },
  { id: 6, agent: 'Content Drafter', action: 'Generated FAQ document for API v3.0 release', status: 'completed', time: '22 min ago', type: 'creation' },
  { id: 7, agent: 'Compliance Officer', action: 'Cleared financial disclosure copy for annual report', status: 'completed', time: '28 min ago', type: 'compliance' },
  { id: 8, agent: 'Publisher', action: 'Distributed newsletter to 45,000 subscribers', status: 'completed', time: '35 min ago', type: 'distribution' },
];

// Content studio sample outputs
export const sampleBlogPost = {
  title: 'Introducing CloudSync Pro: Enterprise File Collaboration Reimagined',
  content: `The modern enterprise demands seamless collaboration across distributed teams, and traditional file-sharing solutions simply cannot keep pace. Today, we are introducing CloudSync Pro -- a fundamentally new approach to enterprise file collaboration that combines real-time editing, intelligent version control, and enterprise-grade security in a single platform.

CloudSync Pro addresses three critical pain points that enterprise teams face daily. First, version conflicts that waste an average of 3.2 hours per team member each week. Second, security gaps that emerge when employees resort to consumer-grade file-sharing tools. Third, the collaboration friction that occurs when teams span multiple time zones and work asynchronously.

Our platform introduces Intelligent Merge Technology, which automatically reconciles concurrent edits without the merge conflicts that plague existing solutions. Combined with our Zero-Trust File Architecture, every document interaction is authenticated, encrypted, and auditable from creation to archival.

Early access customers report a 67% reduction in time spent on document management and a 94% decrease in version-related errors. CloudSync Pro integrates natively with existing enterprise infrastructure including Microsoft 365, Google Workspace, Slack, and over 200 additional platforms through our open API.

CloudSync Pro is available starting today for enterprise teams of 50 or more users, with pricing that scales based on active usage rather than seat count. Visit our enterprise solutions page to schedule a personalized demonstration with our solutions team.`,
  wordCount: 214,
  readTime: '3 min',
  tone: 'Professional, authoritative',
  audience: 'Enterprise IT Decision Makers',
};

export const sampleSocialVariants = [
  {
    platform: 'Twitter/X',
    content: 'Enterprise file collaboration is broken. Version conflicts waste 3.2 hours per team member weekly. CloudSync Pro fixes this with Intelligent Merge Technology -- automatic conflict resolution, zero-trust security, and native integrations with 200+ platforms. Early customers report 67% less time on document management.',
    charCount: 289,
    hashtags: '#EnterpriseTech #CloudSync #Collaboration',
  },
  {
    platform: 'LinkedIn',
    content: `We have been building CloudSync Pro for the past 18 months, and today marks the beginning of a new chapter for enterprise collaboration.

The problem we set out to solve: distributed teams lose an average of 3.2 hours per week to version conflicts and document management overhead.

Our approach: Intelligent Merge Technology that reconciles concurrent edits automatically, wrapped in a Zero-Trust File Architecture where every interaction is authenticated and auditable.

The results from our early access program speak for themselves:
- 67% reduction in document management time  
- 94% decrease in version-related errors
- Native integration with 200+ enterprise platforms

CloudSync Pro is now available for enterprise teams. If your organization struggles with file collaboration at scale, I would welcome the opportunity to discuss how we can help.`,
    charCount: 712,
  },
  {
    platform: 'Instagram',
    content: 'The future of enterprise collaboration starts now. CloudSync Pro brings Intelligent Merge Technology to teams worldwide -- eliminating version conflicts and securing every document interaction with zero-trust architecture. Link in bio for early access.',
    charCount: 248,
    note: 'Pair with product hero image and feature highlight carousel (5 slides)',
  },
];

export const sampleFAQ = [
  { q: 'What is CloudSync Pro?', a: 'CloudSync Pro is an enterprise file collaboration platform that combines real-time editing, intelligent version control, and zero-trust security. It is designed for distributed teams that need seamless collaboration across time zones and platforms.' },
  { q: 'How does Intelligent Merge Technology work?', a: 'Intelligent Merge Technology uses contextual analysis to automatically reconcile concurrent edits made by multiple team members. Unlike traditional merge systems that create conflicts, our technology understands document structure and intent to produce clean, accurate merges.' },
  { q: 'What integrations does CloudSync Pro support?', a: 'CloudSync Pro integrates natively with Microsoft 365, Google Workspace, Slack, Jira, Confluence, and over 200 additional platforms through our open REST API. Custom integrations can be built using our developer SDK.' },
  { q: 'What are the security features?', a: 'CloudSync Pro uses a Zero-Trust File Architecture where every document interaction is authenticated, encrypted in transit and at rest (AES-256), and fully auditable. We support SSO via SAML 2.0 and OIDC, role-based access controls, and comply with SOC 2 Type II, GDPR, and HIPAA requirements.' },
  { q: 'What is the pricing model?', a: 'CloudSync Pro uses usage-based pricing rather than per-seat licensing. This means your organization pays based on active usage, not headcount. Contact our sales team for a customized quote based on your organization\'s needs.' },
];

// Compliance data
export const complianceDocument = {
  title: 'NutriTrack Wellness Platform - Product Launch Blog Post',
  originalContent: `Introducing NutriTrack: The Wellness Platform That Will Transform Your Health

NutriTrack is a revolutionary wellness platform that combines personalized nutrition tracking with AI-powered health insights. Our platform has been clinically proven to help users lose up to 15 pounds in their first month while dramatically improving their cardiovascular health markers.

With NutriTrack's proprietary algorithm, users receive meal plans that are guaranteed to reduce cholesterol levels by up to 30%. Our AI health coach provides real-time guidance that replaces the need for regular medical consultations, helping users manage conditions including diabetes, hypertension, and heart disease from the comfort of their homes.

NutriTrack's supplement marketplace offers pharmaceutical-grade vitamins and minerals that cure common nutritional deficiencies. Our clinical studies demonstrate that NutriTrack users experience 80% fewer sick days compared to non-users, making it an essential investment for both personal health and workplace productivity.

Start your transformation today with a 30-day free trial. Because everyone deserves to feel their healthiest.`,
  violations: [
    {
      id: 'v1',
      severity: 'critical',
      category: 'Health Claims',
      originalText: 'clinically proven to help users lose up to 15 pounds in their first month while dramatically improving their cardiovascular health markers',
      issue: 'Unsubstantiated clinical claims. Making specific weight loss promises and health improvement claims requires peer-reviewed clinical evidence and FDA/FTC compliance.',
      suggestedFix: 'designed to support users in their wellness journey by providing personalized nutrition insights and tracking tools',
      regulation: 'FTC Act Section 5, FDA Dietary Supplement Health and Education Act',
    },
    {
      id: 'v2',
      severity: 'critical',
      category: 'Health Claims',
      originalText: 'guaranteed to reduce cholesterol levels by up to 30%',
      issue: 'Guarantee language with specific percentage claims for health outcomes is prohibited without substantive clinical evidence approved by regulatory bodies.',
      suggestedFix: 'designed to support healthy dietary choices that may contribute to overall wellness goals',
      regulation: 'FTC Health Products Compliance Guidance',
    },
    {
      id: 'v3',
      severity: 'critical',
      category: 'Medical Claims',
      originalText: 'replaces the need for regular medical consultations, helping users manage conditions including diabetes, hypertension, and heart disease',
      issue: 'Claiming a software product can replace medical consultations or manage serious medical conditions constitutes unauthorized medical device/practice claims.',
      suggestedFix: 'complements your existing healthcare routine by providing additional nutritional awareness. NutriTrack is not a substitute for professional medical advice',
      regulation: 'FDA 21 CFR Part 820, FTC Act',
    },
    {
      id: 'v4',
      severity: 'high',
      category: 'Product Claims',
      originalText: 'pharmaceutical-grade vitamins and minerals that cure common nutritional deficiencies',
      issue: 'The word "cure" is a drug claim and cannot be used for dietary supplements. "Pharmaceutical-grade" implies FDA pharmaceutical approval.',
      suggestedFix: 'high-quality vitamins and minerals that may help support daily nutritional needs',
      regulation: 'DSHEA, FTC Dietary Supplement Advertising Guide',
    },
    {
      id: 'v5',
      severity: 'medium',
      category: 'Statistical Claims',
      originalText: '80% fewer sick days compared to non-users',
      issue: 'Comparative health outcome statistics require citation of specific peer-reviewed studies with methodology details.',
      suggestedFix: 'Users have reported feeling more aware of their nutritional habits and overall wellness',
      regulation: 'FTC Endorsement Guidelines',
    },
  ],
  compliantContent: `Introducing NutriTrack: A Wellness Platform for Smarter Nutrition Tracking

NutriTrack is a wellness platform that combines personalized nutrition tracking with AI-powered dietary insights. Our platform is designed to support users in their wellness journey by providing personalized nutrition insights and tracking tools that make it easier to understand and improve daily eating habits.

With NutriTrack's algorithm, users receive customized meal suggestions designed to support healthy dietary choices that may contribute to overall wellness goals. Our AI-powered guidance complements your existing healthcare routine by providing additional nutritional awareness. NutriTrack is not a substitute for professional medical advice, diagnosis, or treatment.

NutriTrack's supplement marketplace offers high-quality vitamins and minerals that may help support daily nutritional needs. Users have reported feeling more aware of their nutritional habits and overall wellness when using the platform as part of a balanced lifestyle approach.

Start exploring smarter nutrition today with a 30-day free trial. Individual results may vary. Consult your healthcare provider before making significant dietary changes.`,
};

// Localization data
export const localizationSamples = [
  {
    language: 'Spanish (Latin America)',
    code: 'es-LA',
    flag: 'ES',
    quality: 97.2,
    content: 'Presentamos CloudSync Pro: Colaboracion Empresarial de Archivos, Reimaginada. La empresa moderna exige una colaboracion fluida entre equipos distribuidos, y las soluciones tradicionales de intercambio de archivos simplemente no pueden mantener el ritmo.',
    adaptationNotes: 'Adapted "reimagined" to "reimaginada" for natural flow. Used formal "usted" register appropriate for enterprise B2B communications in Latin American markets.',
  },
  {
    language: 'French',
    code: 'fr-FR',
    flag: 'FR',
    quality: 96.8,
    content: 'Decouvrez CloudSync Pro : La Collaboration de Fichiers en Entreprise Reinventee. L\'entreprise moderne exige une collaboration transparente entre les equipes distribuees, et les solutions traditionnelles de partage de fichiers ne peuvent tout simplement pas suivre le rythme.',
    adaptationNotes: 'Used "Decouvrez" (Discover) instead of direct translation of "Introducing" which is more natural in French marketing copy. Maintained formal "vous" register.',
  },
  {
    language: 'German',
    code: 'de-DE',
    flag: 'DE',
    quality: 95.4,
    content: 'Wir stellen vor: CloudSync Pro -- Zusammenarbeit an Unternehmensdateien, neu gedacht. Das moderne Unternehmen verlangt nahtlose Zusammenarbeit uber verteilte Teams hinweg, und traditionelle Losungen fur den Dateiaustausch konnen einfach nicht Schritt halten.',
    adaptationNotes: 'German compound words used where appropriate. Formal "Sie" register maintained. Technical terms kept in English where standard in German enterprise IT.',
  },
  {
    language: 'Hindi',
    code: 'hi-IN',
    flag: 'HI',
    quality: 94.1,
    content: 'CloudSync Pro ka parichay: Enterprise File Collaboration ko naye tarike se pesh kiya gaya hai. Aadhunik enterprise ko vitarit teams mein sahjog ki zaroorat hai, aur paramparik file-sharing samadhan gati nahi rakh paate.',
    adaptationNotes: 'Romanized Hindi used for digital distribution. Technical terms (Enterprise, File, Collaboration) retained in English as standard in Indian enterprise communication.',
  },
  {
    language: 'Japanese',
    code: 'ja-JP',
    flag: 'JP',
    quality: 96.0,
    content: 'CloudSync Pro no go-shoukai: Enterprise File Collaboration wo sai-kouchiku. Gendai no kigyou wa, bunsan chimu kan no seamless na kyouryoku wo motomete imasu ga, juurai no file kyouyuu solution wa, sono pace ni tsuiteiku koto ga dekimasen.',
    adaptationNotes: 'Honorific prefix "go-" added to "shoukai" for formal register. Business-appropriate keigo maintained throughout. Product name and key technical terms kept in English.',
  },
  {
    language: 'Arabic',
    code: 'ar-SA',
    flag: 'AR',
    quality: 93.8,
    content: 'Nuqaddim CloudSync Pro: Taawun al-milaffat lil-muassasat, yutad takhayuluhu. Tatatallab al-muassasa al-haditha taawunan salisan bayn al-firaq al-muwazzaa, wa la tastati hal al-musharaka al-taqleediya lil-milaffat muwaakabat dhalik.',
    adaptationNotes: 'Right-to-left text direction required. Formal Modern Standard Arabic used for pan-Arab enterprise audience. Transliterated product name maintained.',
  },
];

// Distribution channels
export const distributionChannels = [
  { id: 'blog', name: 'Company Blog', icon: 'FileText', status: 'active', posts: 94, engagement: '12.4K views/mo', color: 'hsl(175, 80%, 48%)' },
  { id: 'twitter', name: 'Twitter/X', icon: 'Twitter', status: 'active', posts: 256, engagement: '8.2K impressions/mo', color: 'hsl(200, 90%, 55%)' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', status: 'active', posts: 128, engagement: '23.1K impressions/mo', color: 'hsl(210, 80%, 52%)' },
  { id: 'instagram', name: 'Instagram', icon: 'Instagram', status: 'active', posts: 89, engagement: '15.7K reach/mo', color: 'hsl(330, 70%, 55%)' },
  { id: 'email', name: 'Email Newsletter', icon: 'Mail', status: 'active', posts: 71, engagement: '45K subscribers', color: 'hsl(35, 95%, 60%)' },
  { id: 'medium', name: 'Medium', icon: 'BookOpen', status: 'scheduled', posts: 42, engagement: '5.8K reads/mo', color: 'hsl(150, 50%, 50%)' },
  { id: 'youtube', name: 'YouTube', icon: 'Video', status: 'paused', posts: 18, engagement: '3.2K views/mo', color: 'hsl(0, 85%, 55%)' },
  { id: 'podcast', name: 'Podcast', icon: 'Headphones', status: 'paused', posts: 12, engagement: '1.4K listens/mo', color: 'hsl(280, 60%, 55%)' },
];

// Calendar events
export const calendarEvents = [
  { day: 1, title: 'CloudSync Pro launch blog', channel: 'blog', status: 'published' },
  { day: 1, title: 'Launch announcement thread', channel: 'twitter', status: 'published' },
  { day: 2, title: 'Founder perspective post', channel: 'linkedin', status: 'published' },
  { day: 3, title: 'Product feature carousel', channel: 'instagram', status: 'published' },
  { day: 4, title: 'Customer success story', channel: 'blog', status: 'published' },
  { day: 5, title: 'Weekly newsletter', channel: 'email', status: 'published' },
  { day: 7, title: 'Security deep-dive article', channel: 'blog', status: 'scheduled' },
  { day: 8, title: 'Integration tips thread', channel: 'twitter', status: 'scheduled' },
  { day: 9, title: 'Team collaboration post', channel: 'linkedin', status: 'scheduled' },
  { day: 10, title: 'Behind the scenes reel', channel: 'instagram', status: 'scheduled' },
  { day: 12, title: 'CTO interview article', channel: 'blog', status: 'draft' },
  { day: 12, title: 'Weekly newsletter', channel: 'email', status: 'draft' },
  { day: 14, title: 'API v3 announcement', channel: 'twitter', status: 'draft' },
  { day: 15, title: 'Developer guide post', channel: 'linkedin', status: 'draft' },
  { day: 17, title: 'User testimonial series', channel: 'instagram', status: 'draft' },
  { day: 19, title: 'Quarterly review blog', channel: 'blog', status: 'draft' },
  { day: 19, title: 'Weekly newsletter', channel: 'email', status: 'draft' },
  { day: 21, title: 'Industry trends analysis', channel: 'linkedin', status: 'draft' },
  { day: 23, title: 'Feature spotlight thread', channel: 'twitter', status: 'draft' },
  { day: 25, title: 'Partner announcement', channel: 'blog', status: 'draft' },
];

// Analytics engagement data
export const engagementData = [
  { week: 'W1', views: 12400, clicks: 1840, shares: 342, conversions: 89 },
  { week: 'W2', views: 15200, clicks: 2180, shares: 428, conversions: 112 },
  { week: 'W3', views: 18600, clicks: 2950, shares: 567, conversions: 148 },
  { week: 'W4', views: 16800, clicks: 2640, shares: 498, conversions: 134 },
  { week: 'W5', views: 21400, clicks: 3420, shares: 612, conversions: 178 },
  { week: 'W6', views: 24800, clicks: 4100, shares: 745, conversions: 212 },
  { week: 'W7', views: 28200, clicks: 4680, shares: 834, conversions: 247 },
  { week: 'W8', views: 31500, clicks: 5240, shares: 926, conversions: 289 },
];

// Content format performance
export const formatPerformance = [
  { format: 'Blog Posts', views: 45200, engagement: 8.4, conversionRate: 3.2, trend: 'stable' },
  { format: 'Video Content', views: 182400, engagement: 24.1, conversionRate: 5.8, trend: 'rising' },
  { format: 'Social Posts', views: 98600, engagement: 12.7, conversionRate: 2.1, trend: 'stable' },
  { format: 'Email Newsletter', views: 38400, engagement: 18.2, conversionRate: 4.5, trend: 'rising' },
  { format: 'Infographics', views: 67800, engagement: 15.8, conversionRate: 3.9, trend: 'rising' },
  { format: 'Case Studies', views: 22100, engagement: 22.4, conversionRate: 7.2, trend: 'stable' },
];

// Performance pivot data
export const performancePivot = {
  finding: 'Video content outperforms text-based content by 4.2x in engagement and 1.8x in conversion rate across all channels.',
  currentMix: [
    { type: 'Blog Posts', percentage: 35 },
    { type: 'Social Posts', percentage: 30 },
    { type: 'Video Content', percentage: 10 },
    { type: 'Email', percentage: 15 },
    { type: 'Other', percentage: 10 },
  ],
  recommendedMix: [
    { type: 'Blog Posts', percentage: 20 },
    { type: 'Social Posts', percentage: 20 },
    { type: 'Video Content', percentage: 30 },
    { type: 'Email', percentage: 15 },
    { type: 'Other', percentage: 15 },
  ],
  recommendations: [
    'Increase video content production from 10% to 30% of total output',
    'Convert top-performing blog posts into video scripts for repurposing',
    'Allocate 40% of content budget to video production and editing tools',
    'Implement video-first strategy for product launches and feature announcements',
    'Create short-form video variants (under 60 seconds) for Instagram and Twitter/X',
    'Establish a bi-weekly video content calendar with themed series',
  ],
};
