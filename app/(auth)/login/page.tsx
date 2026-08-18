"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-1">
            <Cloud className="h-5 w-5" />
          </div>
          <Link href="/" className="font-heading font-semibold text-xl tracking-tight text-foreground">
            Stratosphere AI
          </Link>
        </div>

        <Card className="w-full bg-card border-border shadow-sm">
          <CardHeader className="p-6 pb-4 text-center">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription className="text-xs">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">Email</Label>
                <Input id="email" type="email" placeholder="aditya@stratosphere.ai" required defaultValue="aditya@stratosphere.ai" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-foreground">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required defaultValue="password123" />
              </div>
              <Button type="submit" className="w-full" size="lg">Sign In</Button>
              <div className="text-center text-xs text-muted-foreground pt-3 border-t border-border mt-4">
                <Link href="/" className="hover:text-foreground transition-colors">← Back to home</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
