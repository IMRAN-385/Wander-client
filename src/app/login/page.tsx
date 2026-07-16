'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn, Compass, User, Crown } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useAuth } from '@/providers/AppProvider';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/lib/api-client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    try {
      const res = await api.post('/api/auth/login', data);
      if (res.data.success) {
        login(res.data.data.user, res.data.data.token);
        toast.success('Welcome back!');
        router.push('/');
      } else {
        setServerError(res.data.error || 'Login failed');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const fillDemo = () => {
    setValue('email', 'demo@wanderlust.com');
    setValue('password', 'Demo@123');
  };

  const fillAdmin = () => {
    setValue('email', 'admin@wanderlust.com');
    setValue('password', 'Demo@123');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}
      />
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/50 to-dark-900/80" />

      {/* Soft animated glow accents */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-400/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent-400/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <motion.span
              className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-600 text-white"
              whileHover={{ rotate: 25, scale: 1.08 }}
              transition={{ duration: 0.4 }}
            >
              <Compass className="w-5 h-5" strokeWidth={2.2} />
            </motion.span>
            <span className="text-xl font-display font-bold text-white">Wanderlust</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Welcome Back</h1>
          <p className="text-white/70 text-sm mt-1">Sign in to continue your journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20"
        >
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm"
            >
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
            >
              <Input
                id="email" label="Email Address" type="email"
                placeholder="you@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.35 }}
              className="relative"
            >
              <Input
                id="password" label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-[34px] text-dark-400 hover:text-dark-600 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.35 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isSubmitting}>
                <LogIn className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="mt-6 space-y-3"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-100" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-dark-400">Quick Access</span></div>
            </div>

            <motion.button
              onClick={fillDemo}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-dark-50 hover:bg-dark-100 text-dark-700 py-3 rounded-2xl text-sm font-medium transition-colors border border-dark-200"
            >
              <User className="w-4 h-4" />
              Demo User Login
            </motion.button>

            <motion.button
              onClick={fillAdmin}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-800 py-3 rounded-2xl text-sm font-medium transition-colors border border-primary-200"
            >
              <Crown className="w-4 h-4" />
              Admin Login
            </motion.button>
          </motion.div>

          <p className="text-center text-sm text-dark-400 mt-6">
            No account? <Link href="/register" className="text-primary-600 font-semibold hover:text-primary-700">Create one</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}