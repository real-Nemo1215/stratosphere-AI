"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const savingsData = [
  { month: "Jan", savings: 0 },
  { month: "Feb", savings: 1200 },
  { month: "Mar", savings: 3100 },
  { month: "Apr", savings: 4500 },
  { month: "May", savings: 4250 },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground">
          Applied Fixes &amp; Savings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track your cost optimization progress over time.
        </p>
      </div>

      {/* Chart card */}
      <Card className="bg-card border-border">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg">Monthly Savings ($)</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={savingsData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e08525" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e08525" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#7a6b5e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#7a6b5e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#d8d0c4"
                />
                <Tooltip
                  formatter={(value: any) => [`$${value}`, "Monthly Savings"]}
                  contentStyle={{
                    backgroundColor: "#faf8f4",
                    borderColor: "#d8d0c4",
                    borderRadius: "8px",
                    color: "#2e2118",
                    fontSize: "12px",
                    boxShadow: "none",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="#e08525"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* History log card */}
      <Card className="bg-card border-border">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-lg">History Log</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-background border border-border">
            <div>
              <p className="font-heading font-semibold text-foreground text-sm">Terminated EC2 - i-0abcd1234</p>
              <p className="text-xs text-muted-foreground mt-0.5">Applied by Aditya on 2026-08-12</p>
            </div>
            <Badge
              variant="outline"
              className="bg-card border-amber text-amber font-semibold self-start sm:self-auto"
            >
              Saved $320/mo
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
