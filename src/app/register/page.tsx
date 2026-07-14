'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { useAuth } from '@/providers/AppProvider';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api-client';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');
    try {
      const res = await api.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (res.data.success) {
        login(res.data.data.user, res.data.data.token);
        toast.success('Account created successfully!');
        router.push('/');
      } else {
        setServerError(res.data.error || 'Registration failed');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <motion.span className="text-2xl" whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}>🌍</motion.span>
            <span className="text-xl font-display font-bold text-dark-900">Wanderlust</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-900">Create Account</h1>
          <p className="text-dark-400 text-sm mt-1">Join the Wanderlust community</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow">
          {serverError && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="name" label="Full Name" type="text" placeholder="John Doe"
              {...register('name')} error={errors.name?.message} />
            <Input id="email" label="Email Address" type="email" placeholder="you@example.com"
              {...register('email')} error={errors.email?.message} />
            <Input id="password" label="Password" type="password" placeholder="Min. 6 characters"
              {...register('password')} error={errors.password?.message} />
            <Input id="confirmPassword" label="Confirm Password" type="password" placeholder="Re-enter password"
              {...register('confirmPassword')} error={errors.confirmPassword?.message} />
            <Button type="submit" variant="accent" size="lg" className="w-full mt-6" disabled={isSubmitting}>
              <UserPlus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}