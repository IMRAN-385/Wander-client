'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import { contactSchema, type ContactFormData } from '../../lib/validators';
import { Input, Textarea } from '@/components/ui/Input';
import  Button  from '@/components/ui/Button';
import { toast } from 'sonner';

const contacts = [
  { icon: Mail, title: 'Email', info: 'hello@wanderlust.com', sub: 'We respond within 24 hours' },
  { icon: MapPin, title: 'Office', info: '42 Discovery Lane, Chattogram', sub: 'Bangladesh' },
  { icon: Phone, title: 'Phone', info: '+880 1234 567890', sub: 'Mon-Fri, 9AM-6PM BDT' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = async (data: ContactFormData) => {
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    toast.success('Message sent! We\'ll get back to you soon.');
    reset();
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 bg-gradient-to-br from-primary-900 to-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-300 text-sm font-semibold uppercase tracking-wider">Get In Touch</span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mt-3 mb-4">Contact Us</h1>
            <p className="text-primary-200/80 max-w-lg mx-auto">Have questions, suggestions, or want to collaborate? Drop us a message.</p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              {contacts.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-5 card-shadow flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 text-sm">{c.title}</h3>
                    <p className="text-dark-700 text-sm">{c.info}</p>
                    <p className="text-dark-400 text-xs">{c.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 card-shadow"
            >
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-display font-bold text-dark-900 mb-2">Message Sent!</h2>
                  <p className="text-dark-400 mb-6">We will get back to you within 24 hours.</p>
                  <Button variant="outline" onClick={() => setSent(false)}>Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input id="name" label="Name" placeholder="John Doe" {...register('name')} error={errors.name?.message} />
                    <Input id="email" label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
                  </div>
                  <Input id="subject" label="Subject" placeholder="How can we help?" {...register('subject')} error={errors.subject?.message} />
                  <Textarea id="message" label="Message" rows={5} placeholder="Tell us what's on your mind..." {...register('message')} error={errors.message?.message} />
                  <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}