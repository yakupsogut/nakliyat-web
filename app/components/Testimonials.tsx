import { getReferanslar } from '@/lib/db';
import ClientTestimonials from './ClientTestimonials';

export default async function Testimonials() {
  const testimonials = await getReferanslar(6);
  return <ClientTestimonials testimonials={testimonials} />;
} 