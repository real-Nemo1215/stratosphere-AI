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
} from "lucide-react";

/* ── Section 1 Data: Why Stratosphere AI ─────────────────────────────────── */
const whyCards = [
  {
    icon: Server,
    badge: "The Idle Resource Blindspot",
    title: "The Ghost Assets Compounding Invisibly",
    body: "Engineering teams move fast. Instances are spun up for testing, databases provisioned for temporary spikes, and EBS volumes detached but never deleted. Without a dedicated FinOps hire, these ghost assets compound invisibly, eating up 15–30% of your monthly cloud bill.",
    bg: "bg-card", // Ash #efefef
    tag: "01 / BLINDSPOT",
  },
  {
    icon: Code,
    badge: "Detection is Only Half the Battle",
    title: "The Fix is a Burden on Engineers",
    body: "Traditional cost monitors tell you that you're wasting money, but they leave the actual cleanup work to the engineer. Writing the Terraform or AWS CLI commands to safely terminate or right-size a resource takes time, context-switching, and carries the risk of breaking production.",
    bg: "bg-background", // Canvas White #ffffff
    tag: "02 / FRICTION",
  },
  {
    icon: Sparkles,
    badge: "From 'You're Wasting Money' to 'Click Approve'",
    title: "The Autonomous Stratosphere Solution",
    body: "Stratosphere AI bridges the gap between detection and action. We don't just find the waste; our AI engine writes the exact fix code for you. Your engineers review the plain-English explanation, click approve, and the bill drops immediately.",
    bg: "bg-secondary", // Ivory #ebe6dd
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
          HERO SECTION — Canvas White band
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-background px-6 py-24 md:py-32 md:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <ScrollReveal>
            <Badge variant="eyebrow" className="mb-6">
              Cloud Cost Intelligence
            </Badge>
          </ScrollReveal>

          <div className="overflow-hidden">
            <h1 className="animate-hero-reveal mb-6 max-w-3xl text-4xl font-heading font-semibold tracking-tight text-foreground md:text-6xl">
              Stop Wasting Money on Idle Cloud Resources
            </h1>
          </div>

          <ScrollReveal delay={150}>
            <p className="mb-10 max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
              Stratosphere AI scans your cloud account, finds wasted spend, and
              has an AI write the exact fix code for you to review and approve.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={280}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg">View Dashboard Demo</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">Start Free Trial</Button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-20 h-px w-24 bg-border" />
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
                            <card.icon className="h-5 w-5 text-amber" />
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
                        <span className="text-amber font-medium">Card 0{idx + 1} of 0{whyCards.length}</span>
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
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber bg-background text-xs font-heading font-semibold text-amber">
                            {step.step}
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border">
                            <step.icon className="h-4 w-4 text-amber" />
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
                        <span className="text-amber font-medium">Stage 0{step.step} / 05</span>
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
