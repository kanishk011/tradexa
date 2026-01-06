'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, this would fetch seller user data
  const sellerUser = {
    id: '2',
    name: 'Seller User',
    email: 'seller@example.com',
    roles: ['SELLER'],
  };

  return (
    <DashboardLayout user={sellerUser} type="seller">
      {children}
    </DashboardLayout>
  );
}
