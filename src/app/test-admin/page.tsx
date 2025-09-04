"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TestAdminPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setAdminRole = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/set-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Admin role set successfully! Please refresh the page.");
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Test Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
          </p>
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Public Metadata:</strong>{" "}
            {JSON.stringify(user.publicMetadata)}
          </p>
          <p>
            <strong>Is Admin:</strong>{" "}
            {(user.publicMetadata as any)?.role === "admin" ? "Yes" : "No"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={setAdminRole} disabled={loading} className="w-full">
            {loading
              ? "Setting Admin Role..."
              : "Set Admin Role for Current User"}
          </Button>

          {message && (
            <div
              className={`p-3 rounded ${
                message.includes("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="/admin" className="block text-blue-600 hover:underline">
            Go to Admin Dashboard
          </a>
          <a href="/admin-test" className="block text-blue-600 hover:underline">
            Go to Admin Test Page (no middleware)
          </a>
          <a href="/debug" className="block text-blue-600 hover:underline">
            Go to Debug Page
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
