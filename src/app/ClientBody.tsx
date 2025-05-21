'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';

interface ClientBodyProps {
  children: React.ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  return (
    <AuthProvider>
      <Layout>{children}</Layout>
    </AuthProvider>
  );
}
