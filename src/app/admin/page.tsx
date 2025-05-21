'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserList from '@/components/admin/UserList';
import SheetList from '@/components/admin/SheetList';
import ProgressReport from '@/components/admin/ProgressReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <Tabs defaultValue="users" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sheets">Sheets</TabsTrigger>
            <TabsTrigger value="reports">Progress Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="pt-4">
            <UserList />
          </TabsContent>

          <TabsContent value="sheets" className="pt-4">
            <SheetList />
          </TabsContent>

          <TabsContent value="reports" className="pt-4">
            <ProgressReport />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
