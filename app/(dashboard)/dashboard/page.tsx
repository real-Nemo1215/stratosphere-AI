import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Server, TrendingDown, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
  const stats = [
    { title: "Total Monthly Waste", value: "$4,250", icon: DollarSign },
    { title: "Resources Scanned", value: "142", icon: Server },
    { title: "Projected Yearly Savings", value: "$51,000", icon: TrendingDown },
    { title: "Critical Findings", value: "7", icon: AlertCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your cloud cost summary.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">EC2 - i-0abcd1234</p>
              <p className="text-sm text-muted-foreground">Idle Instance (0% CPU for 14 days)</p>
            </div>
            <Badge variant="destructive">High Risk</Badge>
          </div>
          <Link href="/findings"><Button variant="outline">View All Findings</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
