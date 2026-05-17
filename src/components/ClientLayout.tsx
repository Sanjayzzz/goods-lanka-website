'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '94777266044';
const WHATSAPP_MESSAGE = "Hello! I'm interested in a Sri Lanka tour package. Can you help me?";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      {isAdmin ? children : <main>{children}</main>}
      {!isAdmin && <Footer />}

      {/* Global WhatsApp Floating Button */}
      {!isAdmin && (
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-50 group"
        >
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: '#25D366' }} />
            <MessageCircle className="w-7 h-7 text-white relative z-10" fill="white" />
          </div>
          {/* Tooltip */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
            Chat on WhatsApp
          </span>
        </a>
      )}
    </>
  );
}
