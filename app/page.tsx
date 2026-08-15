import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Nav */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            Stratosphere AI
          </div>
          <div className="flex gap-4">
            <Link href="/login"><Button variant="ghost">Login</Button></Link>
            <Link href="/login"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary max-w-3xl">
          Stop Wasting Money on Idle Cloud Resources
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Stratosphere AI scans your cloud account, finds wasted spend, and has an AI write the exact fix code for you to approve.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/dashboard"><Button size="lg">View Dashboard Demo</Button></Link>
          <Link href="/login"><Button size="lg" variant="outline">Start Free Trial</Button></Link>
        </div>
      </main>

      {/* Pricing Section (Day 8) */}
      <section id="pricing" className="bg-secondary py-20 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Simple, Transparent Pricing</h2>
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <CardDescription>For engineering teams at mid-size companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$499</span>
                  <span className="text-muted-foreground">/mo per account</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Unlimited resource scans", "AI-generated fix code", "Human-in-the-loop approvals", "Audit logs & SOC2 compliance prep"].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard/settings" className="w-full">
                  <Button className="w-full">Upgrade to Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
