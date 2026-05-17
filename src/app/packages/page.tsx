import type { Metadata } from 'next';
import PackagesClient from './PackagesClient';

export const metadata: Metadata = {
  title: "Tour Packages | Good's Lanka Tours & Travels",
  description: "Explore our premium Sri Lanka tour packages — cultural tours, beach escapes, wildlife safaris, hill country adventures and luxury retreats.",
};

export default function PackagesPage() {
  return <PackagesClient />;
}
