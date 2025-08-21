"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CertificatesPanel({ courseId }: { courseId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/certificates");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.certificates || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const issue = async () => {
    setIssuing(true);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) await load();
    } finally {
      setIssuing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificates</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-2">
            <Button onClick={issue} disabled={issuing}>
              {issuing ? "Issuing..." : "Issue Certificate"}
            </Button>
            <div className="grid gap-2">
              {(items || []).map((c: any) => (
                <a
                  key={c.id}
                  href={c.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  {c.course?.title || "Course"} certificate
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
