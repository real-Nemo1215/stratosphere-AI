"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StickyStack, StickyStackCard } from "@/components/sticky-stack";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  Server,
  Code,
  Sparkles,
  Link as LinkIcon,
  Radar,
  BrainCircuit,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Terminal,
} from "lucide-react";

/* ── Section 1 Data: Why Stratosphere AI ─────────────────────────────────── */
const whyCards = [
  {
    icon: Server,
    badge: "The Idle Resource Blindspot",
    title: "The Ghost Assets Compounding Invisibly",
    body: "Engineering teams move fast. Instances are spun up for testing, databases provisioned for temporary spikes, and EBS volumes detached but never deleted. Without a dedicated FinOps hire, these ghost assets compound invisibly, eating up 15–30% of your monthly cloud bill.",
    bg: "bg-card",
    tag: "01 / BLINDSPOT",
  },
  {
    icon: Code,
    badge: "Detection is Only Half the Battle",
    title: "The Fix is a Burden on Engineers",
    body: "Traditional cost monitors tell you that you're wasting money, but they leave the actual cleanup work to the engineer. Writing the Terraform or AWS CLI commands to safely terminate or right-size a resource takes time, context-switching, and carries the risk of breaking production.",
    bg: "bg-background",
    tag: "02 / FRICTION",
  },
  {
    icon: Sparkles,
    badge: "From 'You're Wasting Money' to 'Click Approve'",
    title: "The Autonomous Stratosphere Solution",
    body: "Stratosphere AI bridges the gap between detection and action. We don't just find the waste; our AI engine writes the exact fix code for you. Your engineers review the plain-English explanation, click approve, and the bill drops immediately.",
    bg: "bg-secondary",
    tag: "03 / SOLUTION",
  },
];

/* ── Section 2 Data: How It Works ────────────────────────────────────────── */
const howSteps = [
  {
    step: 1,
    icon: LinkIcon,
    title: "Connect Securely",
    subtitle: "Read-only least-privilege IAM",
    body: "Link your AWS or GCP account via a read-only, least-privilege IAM role. No data is ever written to your cloud.",
    bg: "bg-card",
  },
  {
    step: 2,
    icon: Radar,
    title: "Scan & Detect",
    subtitle: "Deep cross-resource audit",
    body: "Stratosphere runs a deep scan across EC2, RDS, EBS, S3, and ELB. Our rules engine instantly identifies idle instances, oversized compute, and unattached storage.",
    bg: "bg-background",
  },
  {
    step: 3,
    icon: BrainCircuit,
    title: "AI Fix Generation",
    subtitle: "Google Gemini Flash IaC generation",
    body: "Google Gemini Flash analyzes the finding and writes the exact IaC or CLI snippet required to fix it. It estimates the risk level and the projected monthly savings.",
    bg: "bg-secondary",
  },
  {
    step: 4,
    icon: ShieldCheck,
    title: "Engineer Approval",
    subtitle: "Human-in-the-loop safety guard",
    body: "The AI doesn't touch production blindly. An engineer reviews the plain-English explanation, the savings estimate, and the proposed fix code, then clicks 'Approve' or 'Reject'.",
    bg: "bg-card",
  },
  {
    step: 5,
    icon: TrendingDown,
    title: "Apply & Save",
    subtitle: "Instant savings + audit logging",
    body: "The fix is applied to the mock or live environment. The resource is resized or terminated, and your projected monthly cloud bill drops instantly. The action is logged in the audit trail.",
    bg: "bg-background",
  },
];

const pricingFeatures = [
  "Unlimited resource scans",
  "AI-generated fix code",
  "Human-in-the-loop approvals",
  "Audit logs & SOC2 compliance prep",
];

/* ── Landing Page Component ──────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* ════════════════════════════════════════════════════════════════
          NAV — sticky header
      ════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-10">
          <Link
            href="/"
            className="font-heading text-lg font-semibold tracking-tight text-foreground"
          >
            Stratosphere AI
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#why-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Why Us
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          HERO SECTION — 2-Column Left Text & Right Visual Graphic
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-background px-6 py-16 md:py-24 lg:py-28 md:px-10 border-b border-border/40">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Headline & Action Points */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">

              <div className="overflow-hidden mb-6">
                <h1 className="animate-hero-reveal text-4xl sm:text-5xl lg:text-[54px] font-heading font-semibold tracking-tight text-foreground leading-[1.12]">
                  Stop Wasting Money on Idle Cloud Resources
                </h1>
              </div>

              <ScrollReveal delay={120}>
                <p className="mb-8 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Stratosphere AI scans your AWS and GCP accounts, detects unattached storage and idle instances, and generates exact IaC remediation scripts for one-click engineer approval.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                      View Dashboard Demo <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={260}>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border w-full max-w-lg">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <ShieldCheck className="h-4 w-4 text-accent" />
                      <span>Read-Only</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">Least-privilege IAM</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Human Review</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">Zero blind writes</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <TrendingDown className="h-4 w-4 text-accent" />
                      <span>Avg. 28% Cut</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">In monthly bills</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: High-Fidelity Interactive SaaS Product Visual */}
            <div className="lg:col-span-6 relative">
              <ScrollReveal delay={150}>
                <div className="relative mx-auto max-w-lg lg:max-w-none">

                  {/* Subtle ambient glow behind card */}
                  <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 blur-xl opacity-70 dark:opacity-40" />

                  {/* Main Product Simulator Card */}
                  <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden">

                    {/* Window Title Bar */}
                    <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-destructive/70" />
                        <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                        <div className="h-3 w-3 rounded-full bg-accent/70" />
                        <span className="ml-2 font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                          <Terminal className="h-3 w-3" /> stratosphere-engine / us-east-1
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                        Live Audit
                      </span>
                    </div>

                    {/* Window Body */}
                    <div className="p-5 space-y-4">

                      {/* Active Finding Banner */}
                      <div className="rounded-lg border border-border bg-background p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-semibold text-sm text-foreground">EC2 - i-0abcd1234</span>
                              <Badge variant="destructive" className="text-[10px] py-0 px-2">High Risk</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Idle Compute • 0% CPU utilization for 14 days
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs text-muted-foreground block">Monthly Waste</span>
                            <span className="text-base font-heading font-semibold text-accent">-$320.00/mo</span>
                          </div>
                        </div>
                      </div>

                      {/* Code Remediation Snippet */}
                      <div className="rounded-lg border border-border bg-muted/70 p-3.5 font-mono text-xs text-foreground">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Code className="h-3.5 w-3.5 text-primary" />
                            remediation_script.py (boto3)
                          </span>
                          <span className="text-[10px] text-accent">Generated in 180ms</span>
                        </div>
                        <pre className="leading-relaxed text-[11px] overflow-x-auto text-muted-foreground">
                          <span className="text-primary font-semibold">import</span> boto3{"\n"}
                          {"\n"}
                          <span className="text-primary font-semibold">def</span> <span className="text-foreground font-semibold">terminate_idle_ec2</span>():{"\n"}
                          {"    "}ec2 = boto3.client(<span className="text-accent">&apos;ec2&apos;</span>, region_name=<span className="text-accent">&apos;us-east-1&apos;</span>){"\n"}
                          {"    "}ec2.terminate_instances(InstanceIds=[<span className="text-accent">&apos;i-0abcd1234&apos;</span>]){"\n"}
                          {"    "}<span className="text-muted-foreground/80"># Projected monthly savings: $320.00</span>
                        </pre>
                      </div>

                      {/* Interactive Simulated Approval Bar */}
                      <div className="flex items-center justify-between pt-1 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground hidden sm:inline">Action required:</span>
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            Non-Prod Environment
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground hover:text-destructive">
                            Reject
                          </Button>
                          <Button size="sm" variant="accent" className="h-8 text-xs gap-1.5 shadow-sm">
                            <Check className="h-3.5 w-3.5" /> Approve &amp; Terminate
                          </Button>
                        </div>
                      </div>

                    </div>

                    {/* Window Bottom Info Strip */}
                    <div className="border-t border-border bg-secondary/50 px-4 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Server className="h-3.5 w-3.5 text-primary" />
                        142 Cloud Resources Analyzed
                      </span>
                      <span className="font-medium text-foreground">
                        Total Detected Waste: <span className="text-accent font-semibold">$4,250/mo</span>
                      </span>
                    </div>

                  </div>

                  {/* Floating Micro-Badge for Depth & Polish */}
                  <div className="absolute -bottom-5 -left-4 sm:-left-6 rounded-lg border border-border bg-card p-3 shadow-lg flex items-center gap-3 hidden sm:flex">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">$51,000 / yr</p>
                      <p className="text-[10px] text-muted-foreground">Projected Annual Savings</p>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1: WHY STRATOSPHERE AI — Sticky Stacking Cards
      ════════════════════════════════════════════════════════════════ */}
      <section id="why-us" className="bg-secondary px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1000px]">

          {/* Section Header */}
          <ScrollReveal>
            <div className="mb-16 flex flex-col items-center text-center gap-3">
              <Badge variant="eyebrow">The Problem</Badge>
              <h2 className="max-w-2xl text-3xl font-heading font-semibold tracking-tight text-foreground md:text-4xl">
                Cloud Waste is a Tax on Your Engineering Team
              </h2>
              <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
                Companies routinely rent cloud servers and forget to switch them
                off or right-size what they don&apos;t need, quietly burning
                thousands of dollars a month.
              </p>
            </div>
          </ScrollReveal>

          {/* Sticky Stacking Cards Container */}
          <StickyStack>
            {(progress) => (
              <div className="relative w-full">
                {whyCards.map((card, idx) => (
                  <StickyStackCard
                    key={card.tag}
                    index={idx}
                    total={whyCards.length}
                    progress={progress}
                    topOffset={96}
                    className={card.bg}
                  >
                    <div className="p-8 md:p-12 min-h-[320px] flex flex-col justify-between">
                      {/* Top Bar inside Card */}
                      <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
                            <card.icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                            {card.badge}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground/80">
                          {card.tag}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight text-foreground mb-4">
                          {card.title}
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                          {card.body}
                        </p>
                      </div>

                      {/* Card Footer accent line */}
                      <div className="mt-8 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Stratosphere AI Architecture</span>
                        <span className="text-primary font-medium">Card 0{idx + 1} of 0{whyCards.length}</span>
                      </div>
                    </div>
                  </StickyStackCard>
                ))}
              </div>
            )}
          </StickyStack>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2: HOW STRATOSPHERE AI WORKS — Sticky Stacking Flow
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-background px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1000px]">

          {/* Section Header */}
          <ScrollReveal>
            <div className="mb-16 flex flex-col items-center text-center gap-3">
              <Badge variant="eyebrow">The Core Loop</Badge>
              <h2 className="max-w-2xl text-3xl font-heading font-semibold tracking-tight text-foreground md:text-4xl">
                From Connection to Cost Savings in Minutes
              </h2>
              <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
                A human-in-the-loop workflow designed to safely automate cloud
                cost optimization.
              </p>
            </div>
          </ScrollReveal>

          {/* 5-Step Sticky Stacking Cards */}
          <StickyStack>
            {(progress) => (
              <div className="relative w-full">
                {howSteps.map((step, idx) => (
                  <StickyStackCard
                    key={step.step}
                    index={idx}
                    total={howSteps.length}
                    progress={progress}
                    topOffset={96}
                    className={step.bg}
                  >
                    <div className="p-8 md:p-10 min-h-[260px] flex flex-col justify-between">
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-border pb-5 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-heading font-semibold text-primary">
                            {step.step}
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border">
                            <step.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-xs font-heading font-medium uppercase tracking-wider text-muted-foreground">
                            Step {step.step}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {step.subtitle}
                        </span>
                      </div>

                      {/* Body */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-heading font-semibold tracking-tight text-foreground mb-3">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                          {step.body}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-6 pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                        <span>Autonomous Optimization Loop</span>
                        <span className="text-primary font-medium">Stage 0{step.step} / 05</span>
                      </div>
                    </div>
                  </StickyStackCard>
                ))}
              </div>
            )}
          </StickyStack>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PRICING SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="bg-secondary px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <Badge variant="eyebrow" className="mb-4">Pricing</Badge>
              <h2 className="text-3xl font-heading font-semibold tracking-tight text-foreground md:text-4xl">
                Simple, Transparent Pricing
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="mx-auto max-w-sm">
              <div className="rounded-2xl border border-border bg-background p-8">
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="mb-1 text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground">
                    Pro Plan
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-heading font-semibold tracking-tight text-foreground">
                      $499
                    </span>
                    <span className="text-sm text-muted-foreground">/mo per account</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For engineering teams at mid-size companies
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard/settings" className="block">
                  <Button className="w-full" size="lg">
                    Upgrade to Pro
                  </Button>
                </Link>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  No credit card required to start.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-border bg-background px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground font-heading font-medium">
            Stratosphere AI
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Stratosphere AI. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
