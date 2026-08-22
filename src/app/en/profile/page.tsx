import { Metadata } from 'next';
import { ProfileClient } from '@/app/profile/ProfileClient';

export const metadata: Metadata = {
  title: 'Developer Profile & Saved Stacks - FreeAPI',
  description: 'Manage your custom API stacks, AI prompt blueprints, and bookmarked developer endpoints.',
};

export default function EnProfilePage() {
  return <ProfileClient />;
}
