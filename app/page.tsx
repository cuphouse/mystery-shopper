"use client";

import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronLeft,
  Download,
  FileText,
  Filter,
  Gauge,
  ListChecks,
  Plus,
  Search,
  Share2,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AuditInput,
  IntentCategory,
  categories,
  defaultInput,
  generateMockAudit,
} from "@/data/mock-audit";
import { cn } from "@/lib/utils";

type View = "landing" | "audit" | "results";
type FilterMode = "all" | "brand" | "competitor" | "opportunity";

const valueCards = [
  {
    icon: Search,
    title: "See what AI says about you",
    body: "Simulate buyer-intent prompts and see whether your brand appears, gets cited, or disappears.",
  },
  {
    icon: Trophy,
    title: "Find competitor steal moments",
    body: "Spot the exact questions where competitors are more recommendable than you.",
  },
  {
    icon: FileText,
    title: "Generate answer-ready content fixes",
    body: "Turn gaps into pages, FAQs, schema, comparison blocks, and trust signals.",
  },
];

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<AuditInput>(defaultInput);
  const [competitorDraft, setCompetitorDraft] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [categoryFilter, setCategoryFilter] = useState<"All" | IntentCategory>("All");
  const audit = useMemo(() => generateMockAudit(input), [input]);

  const filteredResults = audit.promptResults.filter((result) => {
    const modeMatch =
      filter === "all" ||
      (filter === "brand" && result.brandMentioned) ||
      (filter === "competitor" && result.competitorWinner !== input.businessName) ||
      (filter === "opportunity" && result.highOpportunity);
    const categoryMatch = categoryFilter === "All" || result.category === categoryFilter;
    return modeMatch && categoryMatch;
  });

  function update<K extends keyof AuditInput>(key: K, value: AuditInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function addCompetitor() {
    const trimmed = competitorDraft.trim();
    if (!trimmed) return;
    update("competitors", [...input.competitors, trimmed]);
    setCompetitorDraft("");
  }

  function submitAudit() {
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-canvas min-h-screen">
      <Header view={view} onNavigate={setView} />
      {view === "landing" && <Landing onStart={() => setView("audit")} />}
      {view === "audit" && (
        <AuditForm
          input={input}
          step={step}
          competitorDraft={competitorDraft}
          onDraftChange={setCompetitorDraft}
          onUpdate={update}
          onAddCompetitor={addCompetitor}
          onRemoveCompetitor={(name) =>
            update(
              "competitors",
              input.competitors.filter((competitor) => competitor !== name),
            )
          }
          onBack={() => setStep((current) => Math.max(0, current - 1))}
          onNext={() => setStep((current) => Math.min(2, current + 1))}
          onSubmit={submitAudit}
        />
      )}
      {view === "results" && (
        <Results
          input={input}
          audit={audit}
          filter={filter}
          categoryFilter={categoryFilter}
          filteredResults={filteredResults}
          onFilterChange={setFilter}
          onCategoryChange={setCategoryFilter}
          onEdit={() => setView("audit")}
        />
      )}
    </div>
  );
}

function Header({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
        <button className="flex items-center gap-2.5 text-left" onClick={() => onNavigate("landing")}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white shadow-[0_4px_14px_-4px_rgb(246_149_1_/_0.5)]">
            <Sparkles className="h-[18px] w-[18px]" />
          </span>
          <span className="leading-tight">
            <span className="flex items-center gap-1.5">
              <span className="font-display text-[15px]">RecoScout</span>
              <span className="rounded-sm border border-[var(--secondary)]/40 bg-[var(--secondary)]/10 px-1 py-px font-mono text-[9px] uppercase tracking-wider text-[var(--secondary)]">
                MVP
              </span>
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Answer Engine Visibility Studio
            </span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            ["landing", "Overview"],
            ["audit", "Audit Builder"],
            ["results", "Report"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => onNavigate(key as View)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === key
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="hidden sm:inline-flex">
            <BookOpenCheck />
            Demo data
          </Button>
          <Button size="sm" variant="gradient" onClick={() => onNavigate("audit")}>
            <Sparkles />
            Run audit
          </Button>
        </div>
      </div>
    </header>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main>
      <section className="border-b border-border/70 bg-background/35">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-10 pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="chip">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Live audit simulator
              </span>
              <span className="chip">SEO vs AEO/GEO</span>
            </div>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              See who answer engines choose.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              RecoScout simulates real buyer questions across search and answer engines,
              then shows where your brand appears, where competitors win, and what content you need
              to fix it.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="gradient" onClick={onStart}>
                Run a visibility audit
                <ArrowRight />
              </Button>
              <Button size="lg" variant="outline">
                <Gauge />
                View sample report
              </Button>
            </div>
          </div>
          <ReportPreview />
        </div>
      </section>
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((card) => (
            <Card key={card.title} className="bg-card/82">
              <CardHeader>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <card.icon className="h-4 w-4" />
                </span>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="bg-card/86">
            <CardHeader>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--secondary)]">
                Why this is different
              </span>
              <CardTitle>SEO shows where you rank. AEO/GEO shows whether you get recommended.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Ranking reports still matter, but AI answers combine your site, competitors, reviews,
                directories, schema, and direct answer quality into one recommendation moment.
              </p>
              <p>
                This MVP turns those recommendation moments into prompts, visibility scores, and
                content actions a team can actually ship.
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden bg-card/86">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Sample mini-report preview</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Directional demo using mocked analysis.</p>
              </div>
              <span className="chip">32 / 100</span>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Brand mentions: 8", "Competitor wins: 17", "Risk: high"].map((item) => (
                  <div key={item} className="rounded-xl border border-border bg-surface p-4">
                    <div className="text-sm font-semibold">{item}</div>
                    <div className="mt-3 h-1.5 rounded-full bg-muted">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-[var(--secondary)]" />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-5" variant="gradient" onClick={onStart}>
                Run a visibility audit
                <ArrowRight />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function ReportPreview() {
  return (
    <div className="panel overflow-hidden p-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="font-display text-xs">RecoScout</div>
              <div className="text-[10px] text-muted-foreground">Answer Visibility Audit</div>
            </div>
          </div>
          <span className="chip">Export report</span>
        </div>
        <div className="grid gap-3 py-4 md:grid-cols-4">
          {[
            ["Visibility", "32", "/100"],
            ["Mentions", "8", "/25"],
            ["Competitors", "17", "/25"],
            ["Readiness", "Med", ""],
          ].map(([label, value, suffix]) => (
            <div key={label} className="rounded-xl border border-border bg-surface p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-semibold">{value}</span>
                <span className="text-xs text-muted-foreground">{suffix}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[1.4fr_0.7fr_0.8fr] bg-muted/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Prompt</span>
              <span>Brand</span>
              <span>Winner</span>
            </div>
            {[
              ["Best provider near me", "No", "Brightline"],
              ["Compare brand options", "Yes", "Brightline"],
              ["Pricing for strategy", "Yes", "Signal House"],
              ["Strongest reviews", "No", "Cedar & Slate"],
            ].map(([prompt, brand, winner]) => (
              <div
                key={prompt}
                className="grid grid-cols-[1.4fr_0.7fr_0.8fr] border-t border-border px-3 py-3 text-xs"
              >
                <span className="font-medium">{prompt}</span>
                <span className={brand === "Yes" ? "text-success" : "text-destructive"}>{brand}</span>
                <span className="text-muted-foreground">{winner}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--secondary)]">
                Steal moment
              </div>
              <div className="mt-2 text-sm font-semibold">Competitors win local and comparison queries.</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add location pages, comparison content, and proof-rich FAQs.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-semibold">Answer gaps</span>
                <span className="chip !py-0.5">High</span>
              </div>
              <div className="space-y-2">
                {[76, 58, 44].map((width, index) => (
                  <div key={width} className="h-1.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--secondary)]"
                      style={{ width: `${width - index * 4}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditForm({
  input,
  step,
  competitorDraft,
  onDraftChange,
  onUpdate,
  onAddCompetitor,
  onRemoveCompetitor,
  onBack,
  onNext,
  onSubmit,
}: {
  input: AuditInput;
  step: number;
  competitorDraft: string;
  onDraftChange: (value: string) => void;
  onUpdate: <K extends keyof AuditInput>(key: K, value: AuditInput[K]) => void;
  onAddCompetitor: () => void;
  onRemoveCompetitor: (name: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="chip mb-2">Audit Builder</span>
          <h1 className="font-display text-3xl sm:text-4xl">Build your AI visibility audit</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Enter the context an answer engine would need to evaluate your business.
          </p>
        </div>
        <div className="flex rounded-2xl border border-border bg-background/70 p-1 shadow-sm">
          {["Basics", "Market", "Prompts"].map((label, index) => (
            <button
              key={label}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold",
                step === index ? "bg-foreground text-background" : "text-muted-foreground",
              )}
              onClick={() => index <= step && onBack()}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>
      <Card className="mx-auto max-w-4xl bg-card/90">
        <CardHeader>
          <CardTitle>
            {step === 0 && "Step 1: Business basics"}
            {step === 1 && "Step 2: Market context"}
            {step === 2 && "Step 3: Prompt settings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Business name" value={input.businessName} onChange={(value) => onUpdate("businessName", value)} />
              <Field label="Website URL" value={input.websiteUrl} onChange={(value) => onUpdate("websiteUrl", value)} />
              <Field label="Industry/category" value={input.industry} onChange={(value) => onUpdate("industry", value)} />
              <Field label="Location/service area" value={input.location} onChange={(value) => onUpdate("location", value)} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Target customer" value={input.targetCustomer} onChange={(value) => onUpdate("targetCustomer", value)} />
                <Field label="Primary offer" value={input.primaryOffer} onChange={(value) => onUpdate("primaryOffer", value)} />
              </div>
              <div>
                <label className="label">Competitors</label>
                <div className="flex gap-2">
                  <input
                    className="field"
                    value={competitorDraft}
                    onChange={(event) => onDraftChange(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), onAddCompetitor())}
                    placeholder="Add a competitor"
                  />
                  <Button type="button" variant="outline" onClick={onAddCompetitor}>
                    <Plus />
                    Add
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {input.competitors.map((competitor) => (
                    <span key={competitor} className="chip">
                      {competitor}
                      <button onClick={() => onRemoveCompetitor(competitor)} aria-label={`Remove ${competitor}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="label">Number of prompts</label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[10, 25, 50].map((count) => (
                    <button
                      key={count}
                      onClick={() => onUpdate("promptCount", count as 10 | 25 | 50)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition",
                        input.promptCount === count
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      <span className="block text-lg font-semibold">{count}</span>
                      <span className="text-xs">buyer-intent prompts</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Prompt categories</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => {
                    const checked = input.categories.includes(category);
                    return (
                      <label
                        key={category}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm",
                          checked ? "border-primary bg-primary/10" : "border-border bg-surface",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={(event) =>
                            onUpdate(
                              "categories",
                              event.target.checked
                                ? [...input.categories, category]
                                : input.categories.filter((item) => item !== category),
                            )
                          }
                        />
                        <span className="grid h-5 w-5 place-items-center rounded-md border border-border bg-background">
                          {checked && <Check className="h-3.5 w-3.5 text-primary" />}
                        </span>
                        {category}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <div className="mt-7 flex justify-between gap-3 border-t border-border pt-5">
            <Button variant="outline" onClick={onBack} disabled={step === 0}>
              <ChevronLeft />
              Back
            </Button>
            {step < 2 ? (
              <Button variant="gradient" onClick={onNext}>
                Continue
                <ArrowRight />
              </Button>
            ) : (
              <Button variant="gradient" onClick={onSubmit}>
                <Sparkles />
                Generate Visibility Audit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="label">{label}</span>
      <input className="field" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Results({
  input,
  audit,
  filter,
  categoryFilter,
  filteredResults,
  onFilterChange,
  onCategoryChange,
  onEdit,
}: {
  input: AuditInput;
  audit: ReturnType<typeof generateMockAudit>;
  filter: FilterMode;
  categoryFilter: "All" | IntentCategory;
  filteredResults: ReturnType<typeof generateMockAudit>["promptResults"];
  onFilterChange: (value: FilterMode) => void;
  onCategoryChange: (value: "All" | IntentCategory) => void;
  onEdit: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Visibility report
            </span>
            <span className="chip">{input.industry}</span>
            <span className="chip">{input.location}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl">{input.businessName}</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Mock analysis across {input.promptCount} buyer-intent prompts for {input.primaryOffer}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onEdit}>
            <ListChecks />
            Edit inputs
          </Button>
          <Button variant="outline">
            <Share2 />
            Share
          </Button>
          <Button variant="gradient">
            <Download />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {[
          ["Visibility Score", `${audit.overview.visibilityScore}/100`, Gauge],
          ["Brand Mentions", audit.overview.brandMentions, Target],
          ["Competitor Mentions", audit.overview.competitorMentions, Trophy],
          ["Answer Readiness", audit.overview.answerReadiness, BookOpenCheck],
          ["Risk Level", audit.overview.riskLevel, Sparkles],
        ].map(([label, value, Icon]) => (
          <Card key={label as string} className="bg-card/88">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{label as string}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-semibold tracking-tight">{value as string}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/88">
        <CardHeader className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Prompt results</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Filter by recommendation outcome and intent category.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["brand", "Brand mentioned"],
              ["competitor", "Competitor won"],
              ["opportunity", "High opportunity"],
            ].map(([key, label]) => (
              <Button
                key={key}
                size="sm"
                variant={filter === key ? "default" : "outline"}
                onClick={() => onFilterChange(key as FilterMode)}
              >
                {label}
              </Button>
            ))}
            <label className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-3 text-xs font-medium">
              <Filter className="h-3.5 w-3.5" />
              <select
                className="bg-transparent outline-none"
                value={categoryFilter}
                onChange={(event) => onCategoryChange(event.target.value as "All" | IntentCategory)}
              >
                <option>All</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Prompt</th>
                  <th className="px-4 py-3">Intent category</th>
                  <th className="px-4 py-3">Brand?</th>
                  <th className="px-4 py-3">Competitor winner</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredResults.map((result) => (
                  <tr key={result.prompt} className="align-top">
                    <td className="max-w-xs px-4 py-4 font-medium">{result.prompt}</td>
                    <td className="px-4 py-4 text-muted-foreground">{result.category}</td>
                    <td className="px-4 py-4">
                      <span className={cn("chip", result.brandMentioned ? "text-success" : "text-destructive")}>
                        {result.brandMentioned ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-4">{result.competitorWinner}</td>
                    <td className="px-4 py-4 tabular-nums">{result.confidence}%</td>
                    <td className="max-w-sm px-4 py-4 text-muted-foreground">{result.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-card/88">
          <CardHeader>
            <CardTitle>Competitor steal report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audit.competitors.map((competitor, index) => (
              <div key={competitor.name} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-card text-xs font-semibold ring-1 ring-border">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-semibold">{competitor.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{competitor.reason}</div>
                    </div>
                  </div>
                  <span className="chip">{competitor.wins} wins</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {competitor.signals.map((signal) => (
                    <span key={signal} className="chip">{signal}</span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Counter-move:</span> {competitor.move}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/88">
          <CardHeader>
            <CardTitle>Answer gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audit.gaps.map((gap) => (
              <div key={gap.category} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{gap.category}</div>
                  <span className={cn("chip", gap.priority === "High" ? "text-destructive" : "text-primary")}>
                    {gap.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground">{gap.problem}</p>
                <p className="mt-1 text-xs text-muted-foreground">{gap.why}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Suggested fix:</span> {gap.fix}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/88">
        <CardHeader>
          <CardTitle>Recommended pages to create</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {audit.pages.map((page) => (
            <div key={page.slug} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{page.title}</div>
                  <div className="mt-1 font-mono text-xs text-[var(--secondary)]">{page.slug}</div>
                </div>
                <span className="chip">{page.priority}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Target question:</span> {page.question}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{page.why}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {page.sections.map((section) => (
                  <span key={section} className="chip">{section}</span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-[var(--primary)]/8 via-card to-[var(--secondary)]/8">
        <CardHeader>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--secondary)]">
            AEO-ready content blocks
          </span>
          <CardTitle>Copy and structure your site can absorb immediately</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/70 p-4 lg:col-span-2">
            <div className="mb-2 text-sm font-semibold">AI answer summary block</div>
            <p className="text-sm leading-relaxed text-muted-foreground">{audit.contentBlocks.summary}</p>
          </div>
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="mb-2 text-sm font-semibold">Suggested schema types</div>
            <div className="flex flex-wrap gap-2">
              {audit.contentBlocks.schema.map((schema) => (
                <span key={schema} className="chip">{schema}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="mb-2 text-sm font-semibold">FAQ section</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {audit.contentBlocks.faqs.map((faq) => (
                <li key={faq}>• {faq}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="mb-2 text-sm font-semibold">Comparison table structure</div>
            <p className="text-sm text-muted-foreground">
              Fit, timeline, pricing model, proof, reviews, service area, and best-use cases.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="mb-2 text-sm font-semibold">Internal linking recommendations</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {audit.contentBlocks.links.map((link) => (
                <li key={link}>• {link}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <footer className="pb-4 text-center text-xs text-muted-foreground">
        RecoScout · Visibility reports are mocked for MVP demo flow · LLM integration placeholder ready
      </footer>
    </main>
  );
}
