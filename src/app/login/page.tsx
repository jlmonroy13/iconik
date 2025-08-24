'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { Loader2, Mail } from 'lucide-react';
import { PROTECTED_ROUTES } from '@/lib/constants/routes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signIn('resend', {
        email,
        callbackUrl: PROTECTED_ROUTES.DASHBOARD,
        redirect: false,
      });

      if (result?.error) {
        setMessage({
          type: 'error',
          text: 'Error al enviar el magic link. Por favor, verifica tu email e intenta de nuevo.',
        });
      } else {
        setMessage({
          type: 'success',
          text: '¡Magic link enviado! Revisa tu correo electrónico para continuar.',
        });
        setEmail('');
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Error al enviar el magic link. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
            <span className="text-2xl">💅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Iconik
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Inicia sesión con magic link
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Message Display */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={isLoading}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando magic link...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar magic link
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
