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
        <h1 className="text-3xl font-bold text-primary">Audit Log</h1>
        <p className="text-muted-foreground">Enterprise governance & compliance trail.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium text-primary">{log.action} - {log.target}</p>
                <p className="text-sm text-muted-foreground">By {log.user} at {log.time}</p>
              </div>
              <Badge variant="outline">{log.action}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
