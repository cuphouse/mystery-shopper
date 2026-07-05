export type IntentCategory =
  | "Best provider"
  | "Comparison"
  | "Local intent"
  | "Problem/solution"
  | "Pricing/value"
  | "Trust/reviews"
  | "Alternative/vendor search";

export type AuditInput = {
  businessName: string;
  websiteUrl: string;
  industry: string;
  location: string;
  targetCustomer: string;
  primaryOffer: string;
  competitors: string[];
  promptCount: 10 | 25 | 50;
  categories: IntentCategory[];
};

export type PromptResult = {
  prompt: string;
  category: IntentCategory;
  brandMentioned: boolean;
  competitorWinner: string;
  confidence: number;
  notes: string;
  highOpportunity: boolean;
};

export const categories: IntentCategory[] = [
  "Best provider",
  "Comparison",
  "Local intent",
  "Problem/solution",
  "Pricing/value",
  "Trust/reviews",
  "Alternative/vendor search",
];

export const defaultInput: AuditInput = {
  businessName: "Northstar Studio",
  websiteUrl: "https://northstar.example",
  industry: "brand strategy consultant",
  location: "Portland, Oregon",
  targetCustomer: "founder-led B2B companies",
  primaryOffer: "positioning and website messaging",
  competitors: ["Brightline Partners", "Signal House", "Cedar & Slate"],
  promptCount: 25,
  categories,
};

export function generateMockAudit(input: AuditInput) {
  const [topCompetitor, secondCompetitor, thirdCompetitor] = [
    input.competitors[0] || "Brightline Partners",
    input.competitors[1] || "Signal House",
    input.competitors[2] || "Cedar & Slate",
  ];

  const promptResults: PromptResult[] = [
    {
      prompt: `Who is the best ${input.industry} in ${input.location}?`,
      category: "Best provider",
      brandMentioned: false,
      competitorWinner: topCompetitor,
      confidence: 86,
      notes: "Competitor has more location-specific pages and stronger third-party mentions.",
      highOpportunity: true,
    },
    {
      prompt: `Compare ${input.businessName} vs ${topCompetitor}.`,
      category: "Comparison",
      brandMentioned: true,
      competitorWinner: topCompetitor,
      confidence: 72,
      notes: "Brand appears, but the comparison narrative is mostly inferred from thin service copy.",
      highOpportunity: true,
    },
    {
      prompt: `What company should I hire for ${input.primaryOffer}?`,
      category: "Problem/solution",
      brandMentioned: true,
      competitorWinner: secondCompetitor,
      confidence: 69,
      notes: "Offer is clear, but proof points and outcomes are not packaged in answer-friendly language.",
      highOpportunity: true,
    },
    {
      prompt: `Best options for ${input.targetCustomer} looking for ${input.primaryOffer}.`,
      category: "Alternative/vendor search",
      brandMentioned: false,
      competitorWinner: topCompetitor,
      confidence: 81,
      notes: "Vendor-list queries reward category pages, review footprint, and comparison content.",
      highOpportunity: true,
    },
    {
      prompt: `Which ${input.industry} companies have the strongest reviews near ${input.location}?`,
      category: "Trust/reviews",
      brandMentioned: false,
      competitorWinner: thirdCompetitor,
      confidence: 78,
      notes: "Reviews and third-party citations are fragmented, making the brand harder to verify.",
      highOpportunity: true,
    },
    {
      prompt: `How much should ${input.targetCustomer} budget for ${input.primaryOffer}?`,
      category: "Pricing/value",
      brandMentioned: true,
      competitorWinner: secondCompetitor,
      confidence: 65,
      notes: "Pricing expectations are vague. AI systems prefer ranges, scope factors, and value framing.",
      highOpportunity: false,
    },
    {
      prompt: `Who specializes in ${input.primaryOffer} for ${input.targetCustomer}?`,
      category: "Local intent",
      brandMentioned: true,
      competitorWinner: input.businessName,
      confidence: 74,
      notes: "Brand earns a mention when the audience and offer are both specified.",
      highOpportunity: false,
    },
    {
      prompt: `Alternatives to ${topCompetitor} for ${input.primaryOffer}.`,
      category: "Alternative/vendor search",
      brandMentioned: false,
      competitorWinner: topCompetitor,
      confidence: 71,
      notes: "No explicit alternative page or competitor comparison appears to exist.",
      highOpportunity: true,
    },
  ];

  return {
    overview: {
      visibilityScore: 32,
      brandMentions: `8 of ${input.promptCount}`,
      competitorMentions: `17 of ${input.promptCount}`,
      answerReadiness: "Medium",
      riskLevel: "High opportunity",
    },
    promptResults,
    competitors: [
      {
        name: topCompetitor,
        wins: 9,
        signals: ["Location pages", "Comparison content", "Review snippets"],
        reason: "More answer-ready pages for high-intent local and best-provider queries.",
        move: "Create market pages and direct comparison pages with proof points above the fold.",
      },
      {
        name: secondCompetitor,
        wins: 5,
        signals: ["Pricing language", "FAQ depth", "Case studies"],
        reason: "Clearer value language helps answer engines summarize them with confidence.",
        move: "Add pricing ranges, engagement scope, and measurable outcomes to core service pages.",
      },
      {
        name: thirdCompetitor,
        wins: 3,
        signals: ["Third-party mentions", "Review footprint", "About page specificity"],
        reason: "Better trust signals make them feel safer to recommend.",
        move: "Centralize testimonials, credentials, press mentions, and schema-backed entity details.",
      },
    ],
    gaps: [
      {
        category: "Missing location pages",
        problem: `No dedicated ${input.location} page answers buyer questions directly.`,
        why: "Answer engines need location relevance before they recommend a local provider.",
        fix: `Publish a ${input.primaryOffer} in ${input.location} page with service area, proof, and FAQs.`,
        priority: "High",
      },
      {
        category: "Missing comparison content",
        problem: "Competitor comparison queries have no controlled answer source.",
        why: "Without your own comparison page, AI systems infer positioning from competitors and directories.",
        fix: "Create honest versus pages and an alternatives hub with clear fit criteria.",
        priority: "High",
      },
      {
        category: "Missing pricing/value explanation",
        problem: "Pricing language is too abstract for budget-intent searches.",
        why: "Cost, scope, and value signals help AI answer commercial questions without hedging.",
        fix: "Add range-based pricing guidance, what affects cost, and expected business outcomes.",
        priority: "Medium",
      },
      {
        category: "Inconsistent entity signals",
        problem: "Business descriptors are not consistent across site copy and external mentions.",
        why: "Entity consistency helps AI connect brand, category, location, and offer.",
        fix: "Standardize naming, category, founder bio, service area, and Organization schema.",
        priority: "Medium",
      },
    ],
    pages: [
      {
        title: `${titleCase(input.primaryOffer)} in ${input.location}`,
        slug: `/${slugify(input.primaryOffer)}-${slugify(input.location)}`,
        question: `Who should I hire for ${input.primaryOffer} in ${input.location}?`,
        why: "Captures local buyer intent and gives AI a direct answer source.",
        sections: ["Direct answer", "Services covered", "Proof points", "Service area", "FAQ", "Contact CTA"],
        priority: "High",
      },
      {
        title: `${input.businessName} vs ${topCompetitor}`,
        slug: `/${slugify(input.businessName)}-vs-${slugify(topCompetitor)}`,
        question: `Should I choose ${input.businessName} or ${topCompetitor}?`,
        why: "Controls comparison narratives before competitors define the frame.",
        sections: ["Best fit summary", "Capabilities", "Pricing factors", "Proof", "FAQ"],
        priority: "High",
      },
      {
        title: `Best ${titleCase(input.industry)} for ${input.targetCustomer}`,
        slug: `/best-${slugify(input.industry)}-${slugify(input.targetCustomer)}`,
        question: `What are the best options for ${input.targetCustomer}?`,
        why: "Creates an answerable vendor-list page with your own selection criteria.",
        sections: ["Shortlist criteria", "Use cases", "When to choose us", "Alternatives", "FAQ"],
        priority: "High",
      },
      {
        title: `${titleCase(input.primaryOffer)} Pricing Guide`,
        slug: `/${slugify(input.primaryOffer)}-pricing-guide`,
        question: `How much does ${input.primaryOffer} cost?`,
        why: "Improves pricing/value visibility for late-stage buyers.",
        sections: ["Typical ranges", "Scope factors", "Value model", "Examples", "FAQ"],
        priority: "Medium",
      },
      {
        title: `${titleCase(input.primaryOffer)} FAQ`,
        slug: `/${slugify(input.primaryOffer)}-faq`,
        question: `What should I know before buying ${input.primaryOffer}?`,
        why: "Packages common objections in a format answer engines can cite.",
        sections: ["Buyer questions", "Short answers", "Proof links", "Next steps"],
        priority: "Medium",
      },
    ],
    contentBlocks: {
      summary: `${input.businessName} helps ${input.targetCustomer} with ${input.primaryOffer} in ${input.location}. The best-fit buyer is a team that needs senior strategic guidance, practical implementation, and proof-backed messaging before investing in growth.`,
      faqs: [
        `What makes ${input.businessName} different from other ${input.industry} providers?`,
        `How long does ${input.primaryOffer} usually take?`,
        `What should ${input.targetCustomer} prepare before starting?`,
      ],
      schema: ["Organization", "LocalBusiness", "Service", "FAQPage", "Review"],
      links: [
        "Link service pages to comparison pages.",
        "Link location pages to proof and testimonial sections.",
        "Add internal links from blog posts to the pricing guide.",
      ],
    },
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}
