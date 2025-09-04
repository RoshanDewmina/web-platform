"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function AdminUserManager() {
  const { user } = useUser();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const setAdminRole = async () => {
    if (!userId.trim()) {
      setMessage({ type: "error", text: "Please enter a user ID" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/set-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Admin role set successfully!" });
        setUserId("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to set admin role",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while setting admin role",
      });
    } finally {
      setLoading(false);
    }
  };

  const isCurrentUserAdmin = user?.publicMetadata?.role === "admin";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Admin User Manager
          {isCurrentUserAdmin && <Badge variant="secondary">Admin</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCurrentUserAdmin && (
          <Alert>
            <AlertDescription>
              You need admin privileges to manage other users.
            </AlertDescription>
          </Alert>
        )}

        {isCurrentUserAdmin && (
          <>
            <div className="space-y-2">
              <label htmlFor="userId" className="text-sm font-medium">
                User ID
              </label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID to make admin"
                disabled={loading}
              />
            </div>

            <Button
              onClick={setAdminRole}
              disabled={loading || !userId.trim()}
              className="w-full"
            >
              {loading ? "Setting Admin Role..." : "Set Admin Role"}
            </Button>

            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
