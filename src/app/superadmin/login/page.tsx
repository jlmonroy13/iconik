'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { PROTECTED_ROUTES } from '@/lib/constants/routes';
import {
  Input,
  Button,
  Card,
  CardContent,
  useNotifications,
} from '@/components/ui';
import { Loader2, Mail } from 'lucide-react';

// Allowed super admin email(s)
const SUPERADMIN_EMAILS = ['jlmonroy13@gmail.com']; // TODO: Replace with your real email

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Only allow super admin emails
    if (!SUPERADMIN_EMAILS.includes(email)) {
      showError(
        'Error',
        'This email is not authorized for super admin access.'
      );
      setIsLoading(false);
      return;
    }

    try {
      // Use magic link (email provider)
      const result = await signIn('resend', {
        email,
        callbackUrl: PROTECTED_ROUTES.SUPER_ADMIN_DASHBOARD,
        redirect: false,
      });
      if (result?.error) {
        showError('Error', 'Failed to send magic link. Please try again.');
      } else {
        showSuccess('Éxito', 'Check your email for the magic link to sign in.');
        setEmail('');
      }
    } catch {
      showError('Error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4'>
      <div className='w-full max-w-md'>
        <Card className='shadow-xl'>
          <CardContent className='p-8'>
            <h1 className='text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white'>
              Super Admin Login
            </h1>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <Input
                label='Email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='superadmin@email.com'
                disabled={isLoading}
                required
              />

              <Button
                type='submit'
                variant='primary'
                size='lg'
                className='w-full'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Sending magic link...
                  </>
                ) : (
                  <>
                    <Mail className='w-4 h-4 mr-2' />
                    Send magic link
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
