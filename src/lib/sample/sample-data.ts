import type { Profile } from "@/features/profiles/schema";
import type { Startup } from "@/features/startups/schema";
import type { FounderProfileData } from "@/features/profiles/founder-profile";
import type { CompanyPageData } from "@/features/startups/company-page";

/**
 * Baked-in showcase data so the public founder/startup pages render rich,
 * LinkedIn-grade content at a shareable URL — independent of the local mock
 * store. With the backend these come from the database instead.
 */

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "W"
  );
}

export const sampleFounders: Record<string, FounderProfileData> = {
  sndatarkar: {
    handle: "sndatarkar",
    name: "Shubham Datarkar",
    verified: true,
    headline: "Founder at Rajmudra Media · Growth marketing for Indian startups",
    location: "Pune, Maharashtra, India",
    avatarUrl: "https://picsum.photos/seed/shubham/200/200",
    avatarText: "SD",
    bannerClass: "bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900",
    followers: 12_400,
    connections: "500+",
    openTo: ["New marketing clients", "Speaking & workshops", "Hiring marketers"],
    currentCompany: { name: "Rajmudra Media", handle: "rajmudra-media", logoText: "RM" },
    about:
      "I run Rajmudra Media, a performance-and-brand marketing studio for early-stage Indian startups. We've helped founders turn a first ad rupee into a repeatable growth engine — paid, organic and lifecycle under one roof.\n\nBefore Rajmudra I led growth at two consumer startups. I care about marketing that compounds: clean tracking, honest reporting, and creative that actually converts.",
    experience: [
      {
        role: "Founder",
        company: "Rajmudra Media",
        companyHandle: "rajmudra-media",
        type: "Full-time",
        start: "2021",
        location: "Pune, India",
        logoText: "RM",
        description:
          "Built a full-service marketing studio serving 40+ Indian startups across D2C, SaaS and fintech. Paid acquisition, SEO, content and lifecycle — run as one pod per client.",
      },
      {
        role: "Head of Growth",
        company: "Freshcart",
        type: "Full-time",
        start: "2018",
        end: "2021",
        logoText: "F",
        description:
          "Owned performance marketing and retention for a grocery D2C brand. Scaled monthly orders 6x while holding CAC flat.",
      },
    ],
  },
  elonmusk: {
    handle: "elonmusk",
    name: "Elon Musk",
    verified: true,
    headline:
      "CEO & Chief Engineer at SpaceX · CEO & Product Architect at Tesla · Founder of xAI, The Boring Company & Neuralink",
    location: "Austin, Texas, United States",
    avatarUrl:"https://picsum.photos/seed/elon/200/200",
    avatarText: "EM", // optional fallback
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 200_000_000,
    connections: "500+",
    openTo: ["Hiring engineers", "Investing in deep tech", "Building the future"],
    currentCompany: { name: "SpaceX", handle: "spacex", logoText: "SX" },
    about:
      "Engineer and entrepreneur building companies to extend the scope and scale of human capability. My focus is on the problems that I think will most affect the future of humanity: sustainable energy and transport (Tesla), making life multiplanetary (SpaceX), high-bandwidth brain–machine interfaces (Neuralink), and safe artificial intelligence (xAI).\n\nI tend to work from first principles — reasoning up from the fundamental truths of physics rather than by analogy — and to optimize relentlessly for engineering and manufacturing at scale. The goal is not incremental improvement, but order-of-magnitude change.",
    experience: [
      {
        role: "Founder, CEO & Chief Engineer",
        company: "SpaceX",
        companyHandle: "spacex",
        type: "Full-time",
        start: "2002",
        location: "Hawthorne, California",
        logoText: "SX",
        description:
          "Founded SpaceX to revolutionize space technology and make life multiplanetary. Led the design of the Falcon 1, Falcon 9, Falcon Heavy and Starship launch vehicles, the Dragon spacecraft, and the Starlink satellite internet constellation. First private company to reach orbit, dock with the ISS, and fly humans to space.",
      },
      {
        role: "CEO & Product Architect",
        company: "Tesla",
        type: "Full-time",
        start: "2008",
        location: "Austin, Texas",
        logoText: "T",
        description:
          "Lead product architecture and engineering for electric vehicles, energy storage and solar. Accelerating the world's transition to sustainable energy.",
      },
      {
        role: "Founder",
        company: "xAI",
        type: "Full-time",
        start: "2023",
        logoText: "X",
        description: "Building AI to understand the true nature of the universe.",
      },
      {
        role: "Founder",
        company: "The Boring Company",
        type: "Full-time",
        start: "2016",
        logoText: "B",
        description: "Tunneling and infrastructure to solve soul-destroying traffic.",
      },
      {
        role: "Co-founder",
        company: "Neuralink",
        type: "Full-time",
        start: "2016",
        logoText: "N",
        description: "Developing ultra-high-bandwidth brain–machine interfaces.",
      },
      {
        role: "Co-founder & CTO/Chairman",
        company: "PayPal (X.com)",
        type: "Full-time",
        start: "1999",
        end: "2002",
        logoText: "P",
        description: "Co-founded the online payments company; acquired by eBay in 2002.",
      },
      {
        role: "Co-founder",
        company: "Zip2",
        type: "Full-time",
        start: "1995",
        end: "1999",
        logoText: "Z",
        description: "Web software for the media industry; acquired by Compaq in 1999.",
      },
    ],
    education: [
      {
        school: "University of Pennsylvania",
        degree: "BS, Physics · BS, Economics (Wharton)",
        start: "1992",
        end: "1997",
        logoText: "P",
      },
      {
        school: "Stanford University",
        degree: "PhD, Applied Physics & Materials Science (deferred)",
        start: "1995",
        logoText: "S",
      },
      {
        school: "Queen's University",
        field: "Pre-transfer studies",
        start: "1990",
        end: "1992",
        logoText: "Q",
      },
    ],
    skills: [
      "Rocketry & Propulsion",
      "Spacecraft Design",
      "Electric Vehicles",
      "Artificial Intelligence",
      "Manufacturing at Scale",
      "Systems Engineering",
      "First-Principles Thinking",
      "Entrepreneurship",
      "Fundraising",
    ],
    activity: [
      {
        text: "Starship is designed to make life multiplanetary. Full and rapid reusability is the key breakthrough needed to make humanity a spacefaring civilization.",
        date: "2d",
        likes: 1_200_000,
        comments: 84_000,
        reposts: 120_000,
      },
      {
        text: "Starlink now connects millions of people in remote and underserved regions with high-speed, low-latency internet. The constellation keeps getting better.",
        date: "1w",
        likes: 640_000,
        comments: 41_000,
        reposts: 58_000,
      },
      {
        text: "Production and manufacturing are vastly harder than the prototype. The factory is the product.",
        date: "3w",
        likes: 980_000,
        comments: 52_000,
        reposts: 73_000,
      },
    ],
    links: [
      { label: "X / Twitter", href: "https://x.com/elonmusk" },
      { label: "SpaceX", href: "https://www.spacex.com" },
      { label: "Tesla", href: "https://www.tesla.com" },
    ],
    alsoViewed: [
      { name: "Gwynne Shotwell", handle: "gwynne-shotwell", headline: "President & COO at SpaceX", avatarText: "GS" },
      { name: "Jeff Bezos", handle: "jeff-bezos", headline: "Founder of Blue Origin & Amazon", avatarText: "JB" },
      { name: "Sam Altman", handle: "sam-altman", headline: "CEO at OpenAI", avatarText: "SA" },
    ],
  },
  "ritika-jain": {
    handle: "ritika-jain",
    name: "Ritika Jain",
    verified: true,
    headline: "Founder & CEO at Terracotta — sustainable homeware for modern India",
    location: "Pune, India",
    avatarUrl:"https://picsum.photos/seed/ritika/200/200",
    avatarText: "RJ",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 18_400,
    connections: "500+",
    openTo: ["Hiring", "Raising pre-seed"],
    currentCompany: { name: "Terracotta & Co.", handle: "terracotta-co", logoText: "T" },
    about:
      "Building Terracotta to make sustainable homeware the default, not the premium. Ex-product at a D2C brand. I care about honest margins and design that lasts.",
    experience: [
      { role: "Founder & CEO", company: "Terracotta & Co.", type: "Full-time", start: "2024", location: "Pune", logoText: "T", description: "Sustainable, artisan-made homeware for modern Indian homes." },
      { role: "Senior Product Manager", company: "Nykaa", type: "Full-time", start: "2020", end: "2023", logoText: "N" },
    ],
    skills: ["Product", "D2C / E-commerce", "Sustainability", "Operations", "Brand"],
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "Website", href: "https://terracotta.example" },
    ],
  },
  "aarav-sharma": {
    handle: "aarav-sharma",
    name: "Aarav Sharma",
    verified: true,
    headline: "Co-founder & CEO at PayNova — payments infrastructure for Indian SMBs",
    location: "Bangalore, India",
    avatarUrl:"https://picsum.photos/seed/aarav/200/200",
    avatarText: "AS",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 32_100,
    connections: "500+",
    openTo: ["Hiring engineers", "Raising Series A"],
    currentCompany: { name: "PayNova", handle: "paynova", logoText: "P" },
    about:
      "Making payments invisible for India's 60M small businesses. Previously built payments at a large bank. Obsessed with reliability and unit economics.",
    experience: [
      { role: "Co-founder & CEO", company: "PayNova", type: "Full-time", start: "2021", location: "Bangalore", logoText: "P" },
      { role: "Product Lead, Payments", company: "Razorpay", type: "Full-time", start: "2017", end: "2021", logoText: "R" },
    ],
    skills: ["Fintech", "Payments", "Product", "Go-to-Market", "Fundraising"],
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "X / Twitter", href: "https://x.com/" },
    ],
  },
  "neha-verma": {
    handle: "neha-verma",
    name: "Dr. Neha Verma",
    verified: true,
    headline: "Founder at MediSync — connected care software for India's clinics",
    location: "Hyderabad, India",
    avatarUrl:"https://picsum.photos/seed/neha/200/200",
    avatarText: "NV",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 12_700,
    connections: "500+",
    openTo: ["Hiring", "Clinical partnerships"],
    currentCompany: { name: "MediSync", handle: "medisync", logoText: "M" },
    about:
      "Physician-turned-founder building software that lets small clinics deliver big-hospital quality care. MBBS + 8 years in clinical practice.",
    experience: [
      { role: "Founder & CEO", company: "MediSync", type: "Full-time", start: "2022", location: "Hyderabad", logoText: "M" },
      { role: "Physician", company: "Apollo Hospitals", type: "Full-time", start: "2014", end: "2022", logoText: "A" },
    ],
    skills: ["Healthtech", "Clinical Ops", "Product", "Regulatory", "Telemedicine"],
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/" }],
  },
  "kabir-rao": {
    handle: "kabir-rao",
    name: "Kabir Rao",
    verified: true,
    headline: "Founder & CEO at NeuralLeap — applied AI agents for enterprises",
    location: "Bengaluru, India",
    avatarUrl:"https://picsum.photos/seed/kabir/200/200",
    avatarText: "KR",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 45_300,
    connections: "500+",
    openTo: ["Hiring AI engineers", "Design partners"],
    currentCompany: { name: "NeuralLeap", handle: "neuralleap", logoText: "N" },
    about:
      "Building reliable AI agents that do real work for enterprises. Ex-ML at a big lab. I think the next decade belongs to applied AI, not demos.",
    experience: [
      { role: "Founder & CEO", company: "NeuralLeap", type: "Full-time", start: "2023", location: "Bengaluru", logoText: "N" },
      { role: "ML Engineer", company: "Google DeepMind", type: "Full-time", start: "2019", end: "2023", logoText: "G" },
    ],
    skills: ["Artificial Intelligence", "LLMs", "Distributed Systems", "Product", "Research"],
    links: [
      { label: "X / Twitter", href: "https://x.com/" },
      { label: "GitHub", href: "https://github.com/" },
    ],
  },
  "sara-khan": {
    handle: "sara-khan",
    name: "Sara Khan",
    verified: true,
    headline: "Co-founder at Bazaaro — a marketplace for India's local artisans",
    location: "Jaipur, India",
    avatarUrl:"https://picsum.photos/seed/sara/200/200",
    avatarText: "SK",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 9_800,
    connections: "500+",
    openTo: ["Hiring", "Seller partnerships"],
    currentCompany: { name: "Bazaaro", handle: "bazaaro", logoText: "B" },
    about:
      "Connecting India's craftspeople directly with the world. Building fair, transparent commerce that pays artisans what they deserve.",
    experience: [
      { role: "Co-founder", company: "Bazaaro", type: "Full-time", start: "2023", location: "Jaipur", logoText: "B" },
      { role: "Category Manager", company: "Meesho", type: "Full-time", start: "2019", end: "2023", logoText: "M" },
    ],
    skills: ["Marketplaces", "Supply", "Operations", "Community", "Growth"],
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/" }],
  },
};

export const sampleStartups: Record<string, CompanyPageData> = {
  "rajmudra-media": {
    slug: "rajmudra-media",
    name: "Rajmudra Media",
    verified: true,
    tagline: "Performance & brand marketing studio for Indian startups.",
    industry: "Marketing",
    location: "Pune, Maharashtra, India",
    logoUrl: "https://picsum.photos/seed/rajmudra-logo/100/100",
    logoText: "RM",
    bannerClass: "bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900",
    followers: 18_600,
    employeesLabel: "24 employees",
    website: "https://rajmudramedia.in",
    upvotes: 342,
    commentsCount: 48,
    topics: ["Marketing", "Growth", "D2C", "SEO", "Branding", "Content"],
    about:
      "Rajmudra Media is a performance-and-brand marketing studio built for early-stage Indian founders. We run paid acquisition, SEO, content and lifecycle marketing as a single pod per client — so growth compounds instead of scattering across five vendors.\n\nSince 2021 we've worked with 40+ startups across D2C, SaaS and fintech, turning first ad spends into repeatable, measurable growth engines. Fixed scope, fixed price, honest reporting.",
    overview: {
      website: "https://rajmudramedia.in",
      industry: "Marketing & Advertising",
      companySize: "11–50 employees",
      headquarters: "Pune, India",
      founded: "2021",
      type: "Privately Held · Studio",
      specialties: [
        "Performance Marketing",
        "SEO",
        "Content & Social",
        "Lifecycle & Email",
        "Brand & Creative",
        "Landing-page CRO",
      ],
    },
    stats: [
      { label: "Startups served", value: "40+" },
      { label: "Avg. ROAS", value: "3.8x" },
      { label: "Ad spend managed", value: "₹12Cr+" },
      { label: "Team", value: "24" },
      { label: "Founded", value: "2021" },
      { label: "NPS", value: "72" },
    ],
    traction: {
      title: "Active retainers per year",
      points: [
        { label: "2021", value: 6 },
        { label: "2022", value: 14 },
        { label: "2023", value: 22 },
        { label: "2024", value: 31 },
      ],
    },
    products: [
      {
        name: "Launch",
        tag: "₹15,000 / mo",
        description: "One paid channel, four content pieces a month, a landing page and a monthly report.",
        image: "https://picsum.photos/seed/rm-launch/400/300",
      },
      {
        name: "Growth",
        tag: "₹25,000 / mo",
        description: "Two channels, SEO, lifecycle email and a bi-weekly review — the full growth stack.",
        image: "https://picsum.photos/seed/rm-growth/400/300",
      },
      {
        name: "Scale",
        tag: "₹50,000 / mo",
        description: "A dedicated pod with a strategist and creative production for post-PMF startups.",
        image: "https://picsum.photos/seed/rm-scale/400/300",
      },
    ],
    people: [
      { name: "Shubham Datarkar", role: "Founder & Growth Lead", handle: "sndatarkar", avatarText: "SD", bio: "Runs performance and strategy across accounts.", image: "https://picsum.photos/seed/shubham/200/200" },
      { name: "Aditi Kulkarni", role: "Head of Content & SEO", avatarText: "AK", bio: "Owns organic — content strategy, briefs and technical SEO.", image: "https://picsum.photos/seed/aditi/200/200" },
      { name: "Rohan Pillai", role: "Performance Marketing Lead", avatarText: "RP", bio: "Meta, Google and LinkedIn paid acquisition.", image: "https://picsum.photos/seed/rohan/200/200" },
      { name: "Sneha Rao", role: "Creative Director", avatarText: "SR", bio: "Brand systems, ad creative and landing pages.", image: "https://picsum.photos/seed/sneha/200/200" },
    ],
    reviews: [
      {
        client: "Ankit Bansal",
        company: "Nourish D2C",
        rating: 5,
        review: "Rajmudra took us from scattered agencies to one team that actually owns the number. ROAS up, reporting finally honest.",
      },
      {
        client: "Priya Nair",
        company: "LedgerPro SaaS",
        rating: 5,
        review: "The content and SEO engine they built still compounds months later. Worth every rupee.",
      },
    ],
    updates: [
      {
        text: "Wrapped Q1 for a D2C client — 4.2x blended ROAS and a 38% lift in repeat orders off the new lifecycle flows.",
        date: "3d",
        likes: 640,
        comments: 42,
        reposts: 18,
      },
      {
        text: "We're hiring a Performance Marketing Associate in Pune. If you love clean tracking and creative testing, come build with us.",
        date: "1w",
        likes: 210,
        comments: 27,
        reposts: 9,
      },
    ],
    leadership: [
      { name: "Shubham Datarkar", role: "Founder & Growth Lead", handle: "sndatarkar", avatarText: "SD" },
      { name: "Aditi Kulkarni", role: "Head of Content & SEO", avatarText: "AK" },
    ],
    jobs: [
      { title: "Performance Marketing Associate", location: "Pune, India", type: "Full-time" },
      { title: "Content Writer (SaaS)", location: "Remote", type: "Full-time" },
      { title: "Paid Social Specialist", location: "Pune, India", type: "Contract" },
    ],
    links: [
      { label: "Website", href: "https://rajmudramedia.in" },
      { label: "Case studies", href: "https://rajmudramedia.in/work" },
    ],
    alsoViewed: [
      { name: "BrightFunnel", slug: "brightfunnel", industry: "Marketing", logoText: "B" },
      { name: "Storyleaf", slug: "storyleaf", industry: "Marketing", logoText: "S" },
    ],
  },
  spacex: {
    slug: "spacex",
    name: "SpaceX",
    verified: true,
    tagline: "Space Exploration Technologies Corp. — making humanity multiplanetary.",
    industry: "Aviation & Aerospace",
    location: "Hawthorne, California",
    logoUrl:"https://picsum.photos/seed/spacex-logo/100/100",
    logoText: "SX",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 8_400_000,
    employeesLabel: "13,000+ employees",
    website: "https://www.spacex.com",
    upvotes: 4870,
    commentsCount: 612,
    topics: ["Space", "Hardware", "DeepTech", "Satellites", "Climate",  "Technology","Funding","Operations"],
    about:
      "SpaceX designs, manufactures and launches the world's most advanced rockets and spacecraft. Founded in 2002 by Elon Musk,SpaceX designs, manufactures and launches the world's most advanced rockets and spacecraft. Founded in 2002 by Elon Musk, the company has reduced the cost and increased the reliability of access to space, culminating in the first reusable orbital-class rockets.\n\nSpaceX's Falcon 9 and Falcon Heavy launch vehicles and Dragon spacecraft carry cargo and crew to the International Space Station for NASA, deploy commercial and national-security payloads, and fly private astronauts. Starlink, the company's satellite internet constellation, delivers high-speed broadband to millions of customers worldwide. Starship — the fully reusable super-heavy launch system — is being developed to carry crew and cargo to the Moon, Mars and beyond.",
    overview: {
      website: "https://www.spacex.com",
      industry: "Aviation & Aerospace / Space Transportation",
      companySize: "10,001+ employees",
      headquarters: "Hawthorne, California",
      founded: "2002",
      type: "Privately Held",
      specialties: [
        "Reusable Rockets",
        "Spacecraft",
        "Human Spaceflight",
        "Satellite Internet (Starlink)",
        "Launch Services",
        "Propulsion",
        "Manufacturing",
      ],
    },
    stats: [
      { label: "Falcon launches", value: "400+" },
      { label: "Starlink satellites", value: "6,000+" },
      { label: "Astronauts flown", value: "50+" },
      { label: "Booster landings", value: "350+" },
      { label: "Founded", value: "2002" },
      { label: "Countries served", value: "100+" },
    ],
    traction: {
      title: "Falcon orbital launches per year",
      points: [
        { label: "2019", value: 13 },
        { label: "2020", value: 26 },
        { label: "2021", value: 31 },
        { label: "2022", value: 61 },
        { label: "2023", value: 96 },
        { label: "2024", value: 134 },
      ],
    },
    funding: {
      totalRaised: "$10B+",
      valuation: "~$350B",
      lastRound: "Secondary · 2024",
      investors: [
        "Founders Fund",
        "Sequoia Capital",
        "Andreessen Horowitz",
        "Google",
        "Fidelity",
        "Gigafund",
        "Baillie Gifford",
      ],
    },
    products: [
      {
        name: "Falcon 9",
        tag: "Launch",
        description: "Reusable two-stage orbital-class rocket — the workhorse of global launch.",
        image:"https://picsum.photos/seed/falcon9/400/300",
      },
      {
        name: "Falcon Heavy",
        tag: "Launch",
        description: "One of the most powerful operational rockets in the world.",
        image:"https://picsum.photos/seed/falcon-heavy/400/300",
      },
      {
        name: "Dragon",
        tag: "Spacecraft",
        description: "Crew and cargo spacecraft servicing the International Space Station.",
        image:"https://picsum.photos/seed/dragon/400/300",
      },
      {
        name: "Starship",
        tag: "In development",
        description: "Fully reusable super-heavy launch system for the Moon and Mars.",
        image:"https://picsum.photos/seed/starship/400/300",

      },
      {
        name: "Starlink",
        tag: "Connectivity",
        description: "Low-Earth-orbit satellite internet serving millions worldwide.",
        image:"https://picsum.photos/seed/starlink/400/300",
      },
      {
        name: "Raptor",
        tag: "Propulsion",
        description: "Full-flow staged-combustion methalox engine powering Starship.",
        image:"https://picsum.photos/seed/raptor/400/300",
      }
    ],
    people: [
      { name: "Elon Musk", role: "Founder, CEO & Chief Engineer", handle: "elonmusk", avatarText: "EM",bio:"Leading innovation in aerospace and space exploration. Focused on building technologies for a multiplanetary future.", image:"data:image/webp;base64,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" },
      { name: "Gwynne Shotwell", role: "President & COO", avatarText: "GS",bio: "Driving operational excellence and global business strategy. Leading commercial growth and mission execution.", image:"https://picsum.photos/seed/gwynne/200/200" },
      { name: "Bret Johnsen", role: "Chief Financial Officer", avatarText: "BJ",bio: "Overseeing financial strategy and corporate growth. Focused on sustainable expansion and operational efficiency.", image:"https://picsum.photos/seed/bret/200/200" },
      { name: "William Gerstenmaier", role: "VP, Build & Flight Reliability", avatarText: "WG",    bio: "Ensuring mission safety and flight reliability. Leading engineering excellence across space programs.", image:"https://picsum.photos/seed/william/200/200" },
      { name: "Jessica Jensen", role: "VP, Dragon & Falcon Engineering", avatarText: "JJ",    bio: "Leading Dragon and Falcon engineering initiatives. Passionate about innovation and human spaceflight.", image:"https://picsum.photos/seed/jessica/200/200" },
      { name: "Kiko Dontchev", role: "VP, Launch", avatarText: "KD",    bio: "Managing launch operations and mission execution. Focused on reliability, speed, and scale.",image:"https://picsum.photos/seed/kiko/200/200" },
    ],
    reviews: [
  {
    client: "Sarah Thompson",
    company: "NASA",
    rating: 5,
    review:
      "SpaceX has consistently delivered exceptional launch capabilities with outstanding reliability and operational excellence.",
    video: "https://www.youtube.com/embed/0F9NViANva8?si=r2rJLv48o6wDrUMA",
  },
  {
    client: "Michael Chen",
    company: "OneWeb",
    rating: 5,
    review:
      "The team's technical expertise, communication, and execution exceeded our expectations.",
    verticalVideo:"https://www.youtube.com/embed/9gmhdP82l3k",
  },
  {
    client: "Jennifer Roberts",
    company: "US Space Force",
    rating: 5,
    review:
      "A trusted long-term partner with industry-leading innovation and on-time mission delivery.",
  },
],
    updates: [
      {
        text: "Falcon 9 successfully launched 23 Starlink satellites to low-Earth orbit from Cape Canaveral, and the first stage landed on the droneship — the 18th flight of this booster.",
        date: "1d",
        likes: 92_000,
        comments: 3_400,
        reposts: 11_000,
      },
      {
        text: "Starship completed another integrated flight test. Each test brings us closer to a fully and rapidly reusable transportation system for the Moon and Mars.",
        date: "5d",
        likes: 210_000,
        comments: 9_800,
        reposts: 27_000,
      },
      {
        text: "Crew Dragon safely returned four astronauts from the International Space Station, splashing down off the coast of Florida.",
        date: "2w",
        likes: 130_000,
        comments: 5_100,
        reposts: 14_000,
      },
    ],
    leadership: [
      { name: "Elon Musk", role: "Founder, CEO & Chief Engineer", handle: "elonmusk", avatarText: "EM" },
      { name: "Gwynne Shotwell", role: "President & Chief Operating Officer", avatarText: "GS" },
      { name: "Bret Johnsen", role: "Chief Financial Officer", avatarText: "BJ" },
    ],
    jobs: [
      { title: "Propulsion Engineer — Raptor", location: "Hawthorne, CA", type: "Full-time" },
      { title: "Starlink Software Engineer", location: "Redmond, WA", type: "Full-time" },
      { title: "Launch Engineer", location: "Cape Canaveral, FL", type: "Full-time" },
      { title: "Build & Manufacturing Technician", location: "Starbase, TX", type: "Full-time" },
    ],
    links: [
      { label: "Website", href: "https://www.spacex.com" },
      { label: "Starlink", href: "https://www.starlink.com" },
      { label: "X / Twitter", href: "https://x.com/SpaceX" },
    ],
    alsoViewed: [
      { name: "Tesla", slug: "tesla", industry: "Electric Vehicles & Clean Energy", logoText: "T" },
      { name: "Blue Origin", slug: "blue-origin", industry: "Space Transportation", logoText: "BO" },
      { name: "NASA", slug: "nasa", industry: "Government · Space Agency", logoText: "NA" },
      { name: "xAI", slug: "xai", industry: "Artificial Intelligence", logoText: "X" },
    ],
  },
  "terracotta-co": {
    slug: "terracotta-co",
    name: "Terracotta & Co.",
    verified: true,
    tagline: "Sustainable homeware, reimagined.",
    industry: "Consumer · D2C",
    location: "Pune, India",
    logoText: "T",
    logoUrl:"data:image/jpeg;base64,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",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 24_000,
    employeesLabel: "11–50 employees",
    website: "https://terracotta.example",
    upvotes: 1_280,
    commentsCount: 96,
    topics: ["E-commerce", "Sustainability", "Home", "Design","Funding","Accounting","Technology"],
    about:
      "Sustainable, beautifully-made homeware for modern Indian homes — hand-finished dinnerware and natural-fibre textiles, made with artisan clusters and shipped plastic-free.",
    overview: {
      website: "https://terracotta.example",
      industry: "Consumer / D2C",
      companySize: "11–50 employees",
      headquarters: "Pune, India",
      founded: "2024",
      type: "Privately Held",
      specialties: ["D2C", "Sustainability", "Homeware", "Made in India"],
    },
    stats: [
      { label: "Customers", value: "12k+" },
      { label: "Cities", value: "3" },
      { label: "Founded", value: "2024" },
    ],
    leadership: [{ name: "Ritika Jain", role: "Founder & CEO", handle: "ritika-jain", avatarText: "RJ" }],
    jobs: [
      { title: "Founding Designer", location: "Pune", type: "Full-time" },
      { title: "Ops Associate", location: "Pune", type: "Full-time" },
    ],
    links: [
      { label: "Website", href: "https://terracotta.example" },
      { label: "Instagram", href: "https://instagram.com/" },
    ],
  },
  paynova: {
    slug: "paynova",
    name: "PayNova",
    verified: true,
    tagline: "Payments infrastructure for India's small businesses.",
    industry: "Fintech",
    location: "Bangalore, India",
    logoUrl:"https://picsum.photos/seed/paynova-logo/100/100",
    logoText: "P",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 58_000,
    employeesLabel: "51–200 employees",
    website: "https://paynova.example",
    upvotes: 2_140,
    commentsCount: 158,
    topics: ["Fintech", "Payments", "API", "SaaS"],
    about:
      "PayNova gives Indian SMBs a single API for payments, payouts and reconciliation — reliable, affordable and built for scale.",
    overview: {
      website: "https://paynova.example",
      industry: "Financial Services",
      companySize: "51–200 employees",
      headquarters: "Bangalore, India",
      founded: "2021",
      type: "Privately Held",
      specialties: ["Payments", "Payouts", "UPI", "Developer API"],
    },
    stats: [
      { label: "TPV / yr", value: "₹4,000Cr" },
      { label: "Merchants", value: "120k+" },
      { label: "Uptime", value: "99.99%" },
    ],
    funding: {
      totalRaised: "$28M",
      valuation: "$180M",
      lastRound: "Series A · 2024",
      investors: ["Accel", "Lightspeed", "Better Capital"],
    },
    leadership: [{ name: "Aarav Sharma", role: "Co-founder & CEO", handle: "aarav-sharma", avatarText: "AS" }],
    jobs: [
      { title: "Backend Engineer (Go)", location: "Bangalore", type: "Full-time" },
      { title: "Risk Analyst", location: "Remote", type: "Full-time" },
    ],
  },
  medisync: {
    slug: "medisync",
    name: "MediSync",
    tagline: "Connected care software for India's clinics.",
    industry: "Healthtech",
    location: "Hyderabad, India",
    logoUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAxlBMVEX///8yRm6gKy03NDX7+/swRG00MTInPmkiO2jg5Ok5THNvfJfp6/Dd3+afJiifKCouKyyaCg/58vLevL2vVVX19fW2vMkmIiMfGhwqJiju7u6qREYAAADn5+ecGRydICLlzc705+eKiYnd3d2CgYG/vr4/PD10c3OqqamSkZHJyclZV1jAxdBQTk+2trbu3N3Gi4ydnJxlY2PRoKGXAAAWEBKPma3Xq6wWM2KqsL7NlpelNTfCgYKBi6FOXn5CVHhcaoi2Z2hbmY78AAANUUlEQVR4nO2aCXeiStPHexRbs2mbhGFR0NhsQiCBjFlGM5l8/y/1VDegyGJwnXveN3XOvRljpH/8q7qquhChb/u2b/u2/9umngmZV3cP1/+MZGlX738+/t6nr+4Wg8Ht77t/CcSQfnRarXbnKnl9q/d63X7v8eHfIZ09f7RbP8A677EHb/oNZr3R/PEfqXX2DCr94Nb6OOO/WowasfX07r9Q6+w9UYlDtXlUXd92G6n1Ro1TY10+f3SWSGDttzwUU2t+ypDXns/bWSSAei9C8dg6FZaaU4lDXZRBcbWeToB1+XxeQKqGajS6x3ei+vanBGkT1NHV0kpV+gqKqdU4llqXb8VYqgfF1Bo8HaEmXq5S5Q5QXK1DO1GoiKX6UFytlwOqpb6dv25Cqgd1WLXu/25UqT7UwdQS7z9e218glUN1+3qZWv353lhXF62vkfJQve5I1/XB4+9euRNvX/ZD6tRBykF1G7eLpzHIMR6VQcEf/NrdiSL0cJUY6wJmoXqD8V3c81VBNRqj0W5qCW9V6ZtTnD/fZzqFNaX0m+QS1VBcrZsNq5fb2Xs1UqvdvrhCZ50KqO5t4puHgb4Ba6RvK9ZVq7Mhgt7ZQaESqqEv0svcfG7C6i8q1y9l+rMpwN9iLSuheo1xeqHrm9sNWP1ttBL+btCpdX72BVRj9LnaXJuweqNx6fql9raBCaCuvoJqrIXL9c1gVIE1uq3NdPmxqazUgeoO1mocU6u8Av2qLdXP1w1MtaAao8f1S16/DEZlWKOFUFi+3C42pvFaUL1+XgLA6pe08IOabYP4I++9VmtbKIiWayR+rVavUfPEepUXqtO+OK8DJXxm1hy9oJf8GblELT2vaIXdr0O1f1xcnZ23akChx8wm6zbuXvrzAtZTTq2CmyvsZzYhtF8v7gGgHtRLP6vB4mVUMui4+z3PqlUXKpulWhf3bHvUhLr7lRVhftuIx0IFrIxataEy7utcxgD1oNAgmyR7SdHRe4+5lQErVWsHpVpbQj2VdcCglr4oxlacTk8A9TAv7YAhwEqc2GNqnQAKPfXLoUrV+j3Qi0n2CFDX8+pGRR/kJwp3j6O6xe9ne3co6Darqbp6Ua26M8i9oNC4W1LiVk6c/86dY2oW5P2gVhurHEvXdxrQ7gnFNlZXr9iFHGuQV+sUULyWbMDq9rcfoh0ACgJ+MdqEtbVaB4FiWPPRJrXmWx37DgTFsHqbzsj60ymg7gojsfFn1TmGmZ5r5I8DNS9mIcCqzA89vf44YXeoQbdfnAJvOIx263bo+0GxkVgeix1GK9QafZ4Eiu2rwkgMsPrlG/FXXan2hAKs0W0e6+5p3k3VyuLVjvW9odjsqaAWYPFsOlpkqZazrBNA8XHrTe4wCrUHsml//DsT97UPoweBYmrd3uT6kofHkf5rfH2boap97tsB6rkIxcet45x3HhZAMc44sF8zVe0A1Sl5hhxjfeaVuAF/PeongEp/9VjMkuDEvFqQ51cOPCLU3zimb34VoErVgp65d3So17fko4PSzA1q5b+W86IfG6rVUfNr5bF6n7mtnzqwLtT9tlDtVCgkLCqo4Cz6Oc4miId596hKvV6sVrvrVvZP+nyRbbeSs/SRlOpc8CgXRP5jXH0Y7en97Fn0c3Q0qNbrBQSU6E4N2zYc+Od4wxOGnp75DtPDoHdAqI/VE4dW5wPiiU6xrBAwSZqo6OFz0xFZT+vKw++DQv25TKFanQtQLfAV3IwNK57Jx63Vav3iFHePSeN3IKh2Etdnrx32ZTw3klMkjjWz6canVwAljBf99GR/IKg0U159vKlIm1qkuW7Ed0T24KNCrf7L+DNzIDwUVNImCQISgqaEm3nDsm8KG9TqZ8+oh4HqvC//kNq4iMSxsKHxznzD+OWQUO0kzBFSp1gpRWKmEPAhEiqfXh0UqvWaftHUjJRymRKxSOQi/uBjM9YBoFppmaOGlA/wvBHuw6+w9odqt3/yl6JjVXtuJZbiByx73FU86zsIVOv1T+w71yvZc6VYks18CFjzisPoflDguY9n3japk+ZXnsv4sBnyD7HjValae0F1Ws9xyQv8stSEWS4v0w98yMUCrEaZWvtAfbzHSNQmZStbPsZ+EHq45F2MIw2lahWw9oBS425FDJtlAY4tairKFN43WdUpcClWGJdLdhjtHQwqRjK9fGoCZSC+sI8CaRZ7ifpNv5DnsRLF70J3kFOrNlTmIWQGitoyyS0l+aFpECjBKFCGsY/QRHLdqLATiDRJ3s+ptYtSr8uiEnJNlhpgCKKpC14RIZA85EhysmgwNJEjM451MmI56lItfesu4XJ1dPrxnJwJ3IhtLeL7OPaa1PSJGb8VSiRCjoKTJd3hFLkz+KOJ3VzzNpYimqyQGbKP6k7N/rZjpCQxsaKisNsmNrKZXJJlm6IhJWFCJcUGMkvQNNbU0GGEVBniTBSiSbQWXURJfciG7PG0qu58Cr29trhKZ8lrx4/33MxEEYHE41BY3ZaS+1Z9yUZTyUehZU8DgQ59JPpYMQAPNiXXaBWFfpBcU3hYNPr9ft2vJbAv453/+POcjryW/S7cPPJJkgsBT0OCSuF/kWxwqKlEyIy6Q6yBoLKLpkMqWCyr+hksyU59CI3Ny8sWj2iEq/s0wMWQbXt+Ubh5wSKeuITSbA9eCjZATSQPTUEWSXOHCvBIlog8mXJ3K0FgNZdpFQK+Pkg5XYAlyI0Gj2/sIrFJIuiCNdcxrKbgzjBWTDSRp8iQIjQBKMW1ieKgADhdomjIlOBzlFrYt30Sc0G37O7DpPJ+lwRoyuIbNFIJBLtp+5go2OKbTAnRNIEyWAD5kLZg+ykBCtmG1Jj/qIthq2pOpMSBQPBU/XrxchNDwuOUUH5tyRFETQEfTvilAcpkUBMUyqFgAxRzFYseEomar4kesVQkGARbmiv7fNtpTpxSmhLvlnewODWx1eG2DAUTjaoUdjWy4y0FaRygiJFA2fAf4R7CvirA3gMaWDhQsK8FcqTSgMJ1TJzWp2XS2sLUSVpUYHWKXEmZCqHgEilEnkS4Hjxxgzsd2REjSAvBdGLYfLuBtOBU7AsaRCFsWke2hXAoNwHNSjciIZOtfWhLy5QHWUiFYkIprKvIDrIj28MMKpT4u6EccChuJjhQhlwvQNx5oiNAtHliyJKGAhtPpWsZfkuqQF5+GBwWQdjCZVk1mQXsFAo4jDWBkgLRS6FUSOISdDEu01IwXNAYfrCtoEAg2H42xcvhVkyCvaqmkiP6NnKpaEH4EJlXPNj9LOKVOKYkU/UUe/VJEBHwgVewp0j1oDjB8rxArfeAkrE7lAt7DzaPA1eeskwdQ4EcBuE6TiVX9ZUo+Sh8ktc9YLNFG4pAaEMadZAHf2xZzTWoLdOoq6RUGIKpKQdwx3DlCZGpMAkdj/uIp+sp66BUH9qXFVSTipDgiCFGxEV0gnxwOjiOTLVshVa2jSlkemnF80RT4ZGjBCCgrKlDieUK2IZR/MNQXNXCirqEgu2nsew+FSN5AjeIrJkpEIxnDlq1f1jyts+g6gSTOCNo0Cz5LjS5LjhFVqmcas+goKbYwABQhumEkzBRijKokCVQaMgEPHPFoeVNNHVZmgkOd8rqNM6e0GLiOFW7sIiMUqgAeSxdmULUZFDQ8UrSjHdckMM5lKP6mG0MUZlRIWDJ0kk2NZaNHXInNzHgEzEcM8GZBUIHQ2vJ95AUCB5PlKIPwiQKwJbkUKorMS3Bq7AFkTqbcQQtjFNnep7f0TRjdViA6qFaxEKqM/EhqiQTWjn2S61pUZp4RZoIEU6hlEBjNwTpfQhQomskEzaox9rXS28yMzM3CM1mvMlE6niw5UBHSDVUhoqLMWHbXZpyKF9gLQsxaZwz6JAYITSjSX+/S9XLmbo6gMJVSZIjobRRceLLPkWm7Ksu3P0kiW3Ma7XM+i/KuikiQotD0jOEZAW79Qc5ozZe+dDi5ypoG6CtRCI7KoQSQEGBY0VHCdUYike0S9mphmRqSzKzOoQJ2aGGgm3WCxlSenVb8UVTjoSJRKRhqLFA82IoSocxSXpHe/acORMzk2lMiDVxo2YCpUHbLpgzgILDjCsyKNZAyGy3Zsp6k48UDuK5lVEvM8PHCpSxJFwDAsIEs0iklB/7LA7FfGlFVqaoENneP8ALFviZiQv4qGm4QAHK4IhDxX/lNptpV5M55MfPR45h1FibcMA5x3aCSOE96BIqYO2MbXrrgxfoonc+Knxl7vqYGg5Y7DXviNPqyhID8K4xHSQ1VZsYKsV5Jz87xMcVJFi48D600AcO8LxpJfNFy7BJHPeuXZj0ZaYaxzPRtKTcuiy3Eui3obrldcSSf5wAL2CFSnHyiZu2PyuIuJx2nsBcWy74sGQwnB2xnMKCGg8dFO+QRaWOqQbZ/NyBKLtPMXY3uunZ2qk9tzTRKTw/XsbXgbqmXUwzSiNrn/nTAUwoPoTIPF74Zwbd8roPFcs5WWqqNhplMhTB9vGLSh3j3TI3Ih+pa9rF1DDyLcv3eNv33zGB0rgd/rZv+7Zv+/9iwn/Q/pNQ/wOkt7IsbFSvMwAAAABJRU5ErkJggg==",
    logoText: "M",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 14_200,
    employeesLabel: "11–50 employees",
    website: "https://medisync.example",
    upvotes: 870,
    commentsCount: 64,
    topics: ["Health", "SaaS", "AI"],
    about:
      "MediSync helps small clinics run scheduling, records and follow-ups in one place — so independent doctors can deliver big-hospital quality care.",
    overview: {
      website: "https://medisync.example",
      industry: "Hospital & Health Care",
      companySize: "11–50 employees",
      headquarters: "Hyderabad, India",
      founded: "2022",
      type: "Privately Held",
      specialties: ["EHR", "Telemedicine", "Clinic Ops"],
    },
    stats: [
      { label: "Clinics", value: "900+" },
      { label: "Patients", value: "1.2M" },
      { label: "Founded", value: "2022" },
    ],
    leadership: [{ name: "Dr. Neha Verma", role: "Founder & CEO", handle: "neha-verma", avatarText: "NV" }],
    jobs: [{ title: "Full-stack Engineer", location: "Hyderabad", type: "Full-time" }],
  },
  neuralleap: {
    slug: "neuralleap",
    name: "NeuralLeap",
    verified: true,
    tagline: "Applied AI agents that do real work for enterprises.",
    industry: "Artificial Intelligence",
    location: "Bengaluru, India",
    logoText: "N",
    logoUrl:"https://picsum.photos/seed/neuralleap-logo/100/100",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 76_000,
    employeesLabel: "11–50 employees",
    website: "https://neuralleap.example",
    upvotes: 3_320,
    commentsCount: 240,
    topics: ["AI", "Developer Tools", "SaaS", "Productivity"],
    about:
      "NeuralLeap builds reliable AI agents that automate real enterprise workflows — grounded, observable and safe. Not demos; production.",
    overview: {
      website: "https://neuralleap.example",
      industry: "Software Development",
      companySize: "11–50 employees",
      headquarters: "Bengaluru, India",
      founded: "2023",
      type: "Privately Held",
      specialties: ["AI Agents", "LLMs", "Enterprise Automation"],
    },
    stats: [
      { label: "Enterprises", value: "40+" },
      { label: "Tasks / mo", value: "5M+" },
      { label: "Founded", value: "2023" },
    ],
    funding: {
      totalRaised: "$15M",
      valuation: "$120M",
      lastRound: "Seed · 2024",
      investors: ["Sequoia", "Y Combinator", "Elevation"],
    },
    leadership: [{ name: "Kabir Rao", role: "Founder & CEO", handle: "kabir-rao", avatarText: "KR" }],
    jobs: [
      { title: "AI Engineer", location: "Bengaluru", type: "Full-time" },
      { title: "Founding GTM", location: "Remote", type: "Full-time" },
    ],
  },
  bazaaro: {
    slug: "bazaaro",
    name: "Bazaaro",
    tagline: "A marketplace for India's local artisans.",
    industry: "Marketplace",
    location: "Jaipur, India",
    logoText: "B",
    logoUrl:"https://picsum.photos/seed/bazaaro-logo/100/100",
    bannerClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    followers: 11_300,
    employeesLabel: "11–50 employees",
    website: "https://bazaaro.example",
    upvotes: 640,
    commentsCount: 51,
    topics: ["E-commerce", "Marketplace", "Social Impact"],
    about:
      "Bazaaro connects India's craftspeople directly with buyers worldwide — fair pricing, transparent supply, and the story behind every product.",
    overview: {
      website: "https://bazaaro.example",
      industry: "Internet Marketplace Platforms",
      companySize: "11–50 employees",
      headquarters: "Jaipur, India",
      founded: "2023",
      type: "Privately Held",
      specialties: ["Marketplace", "Artisan Commerce", "Logistics"],
    },
    stats: [
      { label: "Artisans", value: "5k+" },
      { label: "Orders", value: "200k+" },
      { label: "Founded", value: "2023" },
    ],
    leadership: [{ name: "Sara Khan", role: "Co-founder", handle: "sara-khan", avatarText: "SK" }],
    jobs: [{ title: "Seller Growth Lead", location: "Jaipur", type: "Full-time" }],
  },
};

/** Map the owner's sparse store profile into the rich page shape (sections degrade). */
export function profileToFounderData(
  p: Profile,
  startup: Startup | null,
): FounderProfileData {
  return {
    handle: p.handle,
    name: p.fullName || "Founder",
    headline: p.headline || "Founder on WeCos",
    location: p.location || undefined,
    about: p.bio || undefined,
    avatarText: initials(p.fullName || "Founder"),
    avatarUrl: p.avatarUrl || undefined,
    connections: "Founder",
    skills: p.skills,
    links: p.links,
    openTo: p.openTo ? [p.openTo] : undefined,
    currentCompany: startup
      ? { name: startup.name, handle: startup.slug, logoText: startup.name.charAt(0).toUpperCase() }
      : undefined,
  };
}

/** Map the owner's sparse store startup into the rich company-page shape. */
export function startupToCompanyData(
  s: Startup,
  founder: Profile | null,
): CompanyPageData {
  return {
    slug: s.slug,
    name: s.name,
    tagline: s.tagline || "A startup on WeCos",
    industry: s.industry,
    location: s.location || undefined,
    about: s.description || undefined,
    logoText: s.name.charAt(0).toUpperCase(),
    logoUrl: s.logoUrl || undefined,
    website: s.website || undefined,
    leadership: founder
      ? [{ name: founder.fullName, role: "Founder", handle: founder.handle, avatarText: initials(founder.fullName) }]
      : undefined,
    // Founder-edited rich sections (products/people/funding) win over the base.
    ...(s.details ?? {}),
    // overview merges base facts with any founder-set keys (e.g. business type),
    // so details.overview never wipes founded/HQ/website. Placed after the spread.
    overview: {
      website: s.website || undefined,
      industry: s.industry,
      companySize: s.teamSize,
      headquarters: s.location || undefined,
      founded: s.foundedYear ? String(s.foundedYear) : undefined,
      specialties: s.tags,
      ...(s.details?.overview ?? {}),
    },
  };
}

/** Directory listings derived from the catalog above. */
export const founders = Object.values(sampleFounders);
export const startups = Object.values(sampleStartups);
