import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | Good's Lanka Tours & Travels",
  description: "Read the privacy policy for Good's Lanka Tours & Travels.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-32 lg:pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-tropical-600 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Legal</span>
        <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-ocean-900 mb-4">Privacy Policy</h1>
        <div className="section-divider mb-8" />
        <p className="text-gray-400 text-sm mb-12">Last updated: January 1, 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including your name, email address, phone number, travel preferences, and payment information when you book tours through our platform. We also collect information about your usage of our website, including pages visited, time spent, and interaction patterns.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Process and manage your tour bookings</li>
              <li>Communicate with you about your trips and reservations</li>
              <li>Send you promotional offers and travel inspiration (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">3. Information Sharing</h2>
            <p>We do not sell your personal information to third parties. We may share your information with trusted service providers (hotels, transport operators) solely to fulfill your tour bookings, and with law enforcement when required by law.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including encrypted data storage and secure SSL/TLS connections for all data transmission.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">5. Cookies</h2>
            <p>Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">6. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal data at any time. You can also opt out of marketing communications. Contact us at privacy@goodslanka.com for any data-related requests.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">7. Contact Us</h2>
            <p>For any privacy-related questions, contact us at:</p>
            <p className="mt-2">
              <strong>Good&apos;s Lanka Tours & Travels</strong><br />
              42 Temple Road, Colombo 03, Sri Lanka<br />
              Email: privacy@goodslanka.com<br />
              Phone: +94 77 726 6044
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
