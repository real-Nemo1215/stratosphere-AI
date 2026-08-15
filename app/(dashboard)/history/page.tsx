"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
        <h1 className="text-3xl font-bold text-primary">Applied Fixes & Savings</h1>
        <p className="text-muted-foreground">Track your cost optimization progress over time.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Savings ($)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b6f47" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b6f47" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeeee" />
                <Tooltip />
                <Area type="monotone" dataKey="savings" stroke="#8b6f47" fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>History Log</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium text-primary">Terminated EC2 - i-0abcd1234</p>
              <p className="text-sm text-muted-foreground">Applied by Aditya on 2026-08-12</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Saved $320/mo</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
