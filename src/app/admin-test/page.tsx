"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUserManager } from "@/components/admin/admin-user-manager";

export default function AdminTestPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Test Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            This is a test admin page - no middleware protection
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminUserManager />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
