import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuditLogPage() {
  const logs = [
    { id: 1, action: "APPROVED", target: "RDS - db-prod-x1", user: "Mohar", time: "2026-08-13 10:30 AM" },
    { id: 2, action: "REJECTED", target: "S3 - stale-bucket", user: "Naib", time: "2026-08-13 09:15 AM" },
    { id: 3, action: "CONNECTED", target: "AWS Production Account", user: "Aditya", time: "2026-08-12 04:00 PM" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground">Audit Log</h1>
        <p className="text-muted-foreground mt-1 text-sm">Enterprise governance &amp; compliance trail.</p>
      </div>
      <Card className="bg-card border-border">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-background border border-border">
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">{log.action} - {log.target}</p>
                <p className="text-xs text-muted-foreground mt-0.5">By {log.user} at {log.time}</p>
              </div>
              <Badge
                variant={log.action === "APPROVED" ? "success" : log.action === "REJECTED" ? "destructive" : "secondary"}
                className="self-start sm:self-auto font-medium"
              >
                {log.action}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
