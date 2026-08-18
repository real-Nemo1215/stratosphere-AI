import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Server, TrendingDown, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
  const stats = [
    { title: "Total Monthly Waste",      value: "$4,250", icon: DollarSign },
    { title: "Resources Scanned",        value: "142",    icon: Server },
    { title: "Projected Yearly Savings", value: "$51,000",icon: TrendingDown },
    { title: "Critical Findings",        value: "7",      icon: AlertCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back! Here&apos;s your cloud cost summary.
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border hover:bg-muted/70 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background border border-border">
                <stat.icon className="h-4 w-4 text-amber" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <div className="text-2xl font-heading font-semibold tracking-tight text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top findings card */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-border">
          <CardTitle className="text-lg">Top Findings</CardTitle>
          <Link href="/findings" className="text-xs text-amber hover:underline inline-flex items-center gap-1 font-medium">
            View all 3 findings <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-background border border-border">
            <div>
              <p className="font-heading font-semibold text-foreground text-sm">EC2 - i-0abcd1234</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Idle Instance (0% CPU for 14 days)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-amber font-heading">+$320/mo</span>
              <Badge variant="risk">High Risk</Badge>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/findings">
              <Button variant="outline" size="sm">
                Go to Findings Action Center
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
