'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, this would fetch admin user data and check permissions
  const adminUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    roles: ['ADMIN'],
  };

  return (
    <DashboardLayout user={adminUser} type="admin">
      {children}
    </DashboardLayout>
  );
}
