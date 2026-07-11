import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Testimonials | GODS LANKA Tours & Travels",
  description: "Read what our travelers say about their Sri Lanka experience with GODS LANKA Tours & Travels.",
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
