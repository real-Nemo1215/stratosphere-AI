"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ConnectAccountPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground">Connect Cloud Account</h1>
        <p className="text-muted-foreground mt-1 text-sm">Mock integration. No real AWS credentials are used.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg">Account Details</CardTitle>
          <CardDescription>Provide a nickname and select the region to scan.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-xs font-medium text-foreground">Account Nickname</Label>
            <Input id="nickname" placeholder="e.g., Production AWS" defaultValue="Production AWS" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region" className="text-xs font-medium text-foreground">Primary Region</Label>
            <Select defaultValue="us-east-1">
              <SelectTrigger id="region">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-east-1">us-east-1 (N. Virginia)</SelectItem>
                <SelectItem value="us-west-2">us-west-2 (Oregon)</SelectItem>
                <SelectItem value="eu-central-1">eu-central-1 (Frankfurt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-background border border-border rounded-lg flex items-start gap-3">
            <input type="checkbox" id="consent" className="mt-1 accent-primary" defaultChecked />
            <Label htmlFor="consent" className="text-xs font-normal text-muted-foreground leading-relaxed cursor-pointer">
              I authorize Stratosphere AI to perform read-only scans of my cloud resources to detect cost waste.
            </Label>
          </div>

          <Button size="lg" className="w-full">Start Scan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
