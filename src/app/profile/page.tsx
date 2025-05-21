'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EditProfileForm from '@/components/profile/EditProfileForm';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <EditProfileForm />
      </div>
    </ProtectedRoute>
  );
}
