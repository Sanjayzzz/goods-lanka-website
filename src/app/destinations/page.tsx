import type { Metadata } from 'next';
import DestinationsClient from './DestinationsClient';

export const metadata: Metadata = {
  title: "Destinations | Good's Lanka Tours & Travels",
  description: "Explore Sri Lanka's most iconic destinations — Sigiriya, Ella, Kandy, Mirissa, Galle, Yala and more. Find your perfect Sri Lankan adventure.",
};

export default function DestinationsPage() {
  return <DestinationsClient />;
}
