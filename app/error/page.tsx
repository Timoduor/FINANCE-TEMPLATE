import { Metadata } from 'next';
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';

export const metadata: Metadata = {
 title: 'Error Page',
};

export default function page() {
 return (
  <main className="flex items-center justify-center md:h-screen">
   error
  </main>
 );
}