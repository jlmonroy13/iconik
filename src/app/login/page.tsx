import { redirectIfAuthenticated } from '@/lib/auth-utils';
import LoginForm from './components/LoginForm';

export default async function LoginPage() {
  // Redirect authenticated users to their dashboard
  await redirectIfAuthenticated();

  return <LoginForm />;
}
