import { Metadata } from 'next';
import { ProfileClient } from './ProfileClient';

export const metadata: Metadata = {
  title: 'Geliştirici Profili & Kayıtlı Stack’ler - FreeAPI',
  description: 'Oluşturduğunuz özel API Stack’lerini, AI promptlarını ve favori servislerinizi yönetin.',
};

export default function ProfilePage() {
  return <ProfileClient />;
}
