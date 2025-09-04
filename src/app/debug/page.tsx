"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Debug Information</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(
              {
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                publicMetadata: user.publicMetadata,
              },
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Is Admin: {user.publicMetadata?.role === "admin" ? "Yes" : "No"}
          </p>
          <p>Role: {(user.publicMetadata as any)?.role || "None"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="/admin" className="block text-blue-600 hover:underline">
            Try /admin route
          </a>
          <a href="/admin-test" className="block text-blue-600 hover:underline">
            Try /admin-test route (no middleware)
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
