import { packages } from '@/data/packages';
import PackageDetailClient from './PackageDetailClient';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = packages.find(p => p.slug === slug);
  if (!pkg) return { title: 'Package Not Found' };
  return {
    title: `${pkg.name} | GODS LANKA Tours & Travels`,
    description: pkg.description,
  };
}

export function generateStaticParams() {
  return packages.map(p => ({ slug: p.slug }));
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = packages.find(p => p.slug === slug);
  if (!pkg) notFound();
  return <PackageDetailClient pkg={pkg} />;
}
