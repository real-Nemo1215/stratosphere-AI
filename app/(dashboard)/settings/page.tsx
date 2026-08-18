import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account and billing.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg">Current Plan</CardTitle>
          <CardDescription>You are currently on the Free Tier.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-3xl font-heading font-semibold tracking-tight text-foreground">$0 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <p className="text-xs text-muted-foreground mt-1">Upgrade to Pro for $499/mo to unlock AI fixes.</p>
          </div>
          <Button size="lg">Upgrade to Pro</Button>
        </CardContent>
      </Card>
    </div>
  );
}
