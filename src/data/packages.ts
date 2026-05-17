export interface Package {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  images: string[];
  duration: string;
  groupSize: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  highlights: string[];
  included: string[];
  itinerary: { day: number; title: string; description: string }[];
}

export const packages: Package[] = [
  {
    id: "1",
    name: "Cultural Triangle Explorer",
    slug: "cultural-triangle-explorer",
    tagline: "Uncover Ancient Kingdoms",
    description: "Journey through Sri Lanka's ancient cities — from the rock fortress of Sigiriya to the sacred city of Kandy. Experience UNESCO World Heritage Sites, ancient temples, and the rich cultural tapestry that makes Sri Lanka unique.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80"
    ],
    duration: "7 Days / 6 Nights",
    groupSize: "2-12 People",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewCount: 342,
    category: "Cultural",
    highlights: ["Sigiriya Rock Fortress", "Temple of the Tooth", "Dambulla Cave Temple", "Polonnaruwa Ruins", "Traditional Dance Show", "Spice Garden Visit"],
    included: ["Airport transfers", "Accommodation", "Breakfast & dinner", "English-speaking guide", "Entrance fees", "AC vehicle"],
    itinerary: [
      { day: 1, title: "Arrival in Colombo", description: "Airport pickup and transfer to Negombo. Evening beach walk and welcome dinner." },
      { day: 2, title: "Dambulla & Sigiriya", description: "Visit Dambulla Cave Temple, then climb the iconic Sigiriya Rock Fortress." },
      { day: 3, title: "Polonnaruwa", description: "Explore the ancient ruins of Polonnaruwa by bicycle." },
      { day: 4, title: "Kandy", description: "Drive to Kandy via a spice garden. Visit the Temple of the Tooth." },
      { day: 5, title: "Kandy Exploration", description: "Royal Botanical Gardens and traditional Kandyan dance show." },
      { day: 6, title: "Tea Country", description: "Visit a tea factory and plantation in the highlands." },
      { day: 7, title: "Departure", description: "Transfer to the airport for departure." }
    ]
  },
  {
    id: "2",
    name: "Tropical Beach Escape",
    slug: "tropical-beach-escape",
    tagline: "Sun, Sand & Serenity",
    description: "Relax on Sri Lanka's most pristine beaches. From the whale-watching paradise of Mirissa to the colonial charm of Galle, this coastal journey combines luxury relaxation with thrilling ocean adventures.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&q=80",
      "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&q=80"
    ],
    duration: "5 Days / 4 Nights",
    groupSize: "2-8 People",
    price: 649,
    originalPrice: 849,
    rating: 4.8,
    reviewCount: 289,
    category: "Beach",
    highlights: ["Mirissa Beach", "Whale Watching", "Galle Fort Tour", "Bentota Water Sports", "Coconut Tree Hill", "Sunset Cruise"],
    included: ["Beach resort stay", "Breakfast", "Whale watching trip", "Water sports session", "Airport transfers", "AC vehicle"],
    itinerary: [
      { day: 1, title: "Arrival at Bentota", description: "Transfer to beach resort. Evening sunset on the beach." },
      { day: 2, title: "Bentota Adventures", description: "Morning water sports — jet ski, banana boat, snorkeling." },
      { day: 3, title: "Galle Fort", description: "Explore the UNESCO Galle Fort, boutiques, and cafés." },
      { day: 4, title: "Mirissa Magic", description: "Early morning whale watching, afternoon at Coconut Tree Hill." },
      { day: 5, title: "Departure", description: "Leisure morning and transfer to airport." }
    ]
  },
  {
    id: "3",
    name: "Hill Country Adventure",
    slug: "hill-country-adventure",
    tagline: "Misty Mountains & Tea Trails",
    description: "Traverse the breathtaking highlands of Sri Lanka. Trek through emerald tea plantations, cross the legendary Nine Arch Bridge, and experience the famous train journey through misty mountain passes.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"
    ],
    duration: "6 Days / 5 Nights",
    groupSize: "2-10 People",
    price: 749,
    originalPrice: 999,
    rating: 4.9,
    reviewCount: 412,
    category: "Adventure",
    highlights: ["Ella Train Journey", "Nine Arch Bridge", "Little Adam's Peak", "Tea Plantation Tour", "Ravana Falls", "Horton Plains"],
    included: ["Boutique hotel stays", "Breakfast & lunch", "Train tickets", "Trekking guide", "Entrance fees", "AC vehicle"],
    itinerary: [
      { day: 1, title: "Kandy Arrival", description: "Arrive in Kandy, visit the botanical gardens." },
      { day: 2, title: "Train to Nuwara Eliya", description: "Scenic train ride through tea country to Nuwara Eliya." },
      { day: 3, title: "Horton Plains", description: "Early morning trek to World's End viewpoint." },
      { day: 4, title: "Ella", description: "Continue to Ella, visit Nine Arch Bridge and tea factory." },
      { day: 5, title: "Ella Adventures", description: "Trek Little Adam's Peak, visit Ravana Falls." },
      { day: 6, title: "Departure", description: "Transfer to Colombo or airport." }
    ]
  },
  {
    id: "4",
    name: "Wildlife Safari Expedition",
    slug: "wildlife-safari-expedition",
    tagline: "Into the Wild",
    description: "Embark on an extraordinary wildlife adventure. Track leopards in Yala, observe elephants in Udawalawe, and discover exotic birdlife — Sri Lanka's wilderness will leave you speechless.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80"
    ],
    duration: "5 Days / 4 Nights",
    groupSize: "2-6 People",
    price: 799,
    originalPrice: 1049,
    rating: 4.8,
    reviewCount: 256,
    category: "Wildlife",
    highlights: ["Yala Leopard Safari", "Udawalawe Elephants", "Bundala Bird Sanctuary", "Camping Experience", "Night Safari", "Wildlife Photography"],
    included: ["Safari lodge stays", "All meals", "4x4 jeep safaris", "Park entrance fees", "Expert naturalist guide", "Airport transfers"],
    itinerary: [
      { day: 1, title: "Arrival", description: "Transfer to Udawalawe, evening elephant sighting." },
      { day: 2, title: "Udawalawe Safari", description: "Full-day safari in Udawalawe National Park." },
      { day: 3, title: "Yala National Park", description: "Transfer to Yala, afternoon leopard safari." },
      { day: 4, title: "Yala Full Day", description: "Early morning and evening safari drives." },
      { day: 5, title: "Departure", description: "Morning bird watching, then transfer to airport." }
    ]
  },
  {
    id: "5",
    name: "Luxury Honeymoon Retreat",
    slug: "luxury-honeymoon-retreat",
    tagline: "Romance in Paradise",
    description: "Celebrate love in the most romantic settings Sri Lanka has to offer. Private villas, candlelit dinners on the beach, couples' spa treatments, and sunset cruises — pure tropical romance.",
    image: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80"
    ],
    duration: "8 Days / 7 Nights",
    groupSize: "2 People",
    price: 1499,
    originalPrice: 1999,
    rating: 5.0,
    reviewCount: 178,
    category: "Luxury",
    highlights: ["Private Villa Stay", "Couples Spa", "Beach Candlelit Dinner", "Sunset Cruise", "Hot Air Balloon", "Private Waterfall Visit"],
    included: ["5-star accommodation", "All meals", "Private chauffeur", "Spa treatments", "Romantic dinner setup", "All excursions"],
    itinerary: [
      { day: 1, title: "Welcome to Paradise", description: "VIP airport pickup, transfer to luxury beach villa." },
      { day: 2, title: "Beach Bliss", description: "Private beach day, couples spa, sunset cocktails." },
      { day: 3, title: "Galle Romance", description: "Explore Galle Fort, boutique shopping, rooftop dinner." },
      { day: 4, title: "Hill Country", description: "Scenic drive to hill country, tea estate visit." },
      { day: 5, title: "Ella Adventure", description: "Nine Arch Bridge, waterfall visit, stargazing." },
      { day: 6, title: "Kandy Culture", description: "Temple visit, botanical gardens, cultural show." },
      { day: 7, title: "Coastal Finale", description: "Return to coast, sunset cruise, farewell dinner." },
      { day: 8, title: "Departure", description: "Leisurely breakfast and airport transfer." }
    ]
  },
  {
    id: "6",
    name: "Complete Sri Lanka Discovery",
    slug: "complete-sri-lanka-discovery",
    tagline: "The Ultimate Journey",
    description: "Experience everything Sri Lanka has to offer in one incredible journey. From ancient ruins to pristine beaches, misty mountains to wildlife safaris — this is the definitive Sri Lankan adventure.",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
    ],
    duration: "14 Days / 13 Nights",
    groupSize: "2-12 People",
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewCount: 523,
    category: "Adventure",
    highlights: ["Sigiriya & Dambulla", "Ella Train", "Yala Safari", "Mirissa Beaches", "Galle Fort", "Kandy Temple", "Tea Country", "Colombo City Tour"],
    included: ["All accommodation", "Daily breakfast & dinner", "Expert guide", "All entrance fees", "Internal transport", "Airport transfers"],
    itinerary: [
      { day: 1, title: "Arrival in Colombo", description: "Welcome and city orientation tour." },
      { day: 2, title: "Negombo & North", description: "Fish market, lagoon, and heading north." },
      { day: 3, title: "Anuradhapura", description: "Ancient city exploration." },
      { day: 4, title: "Sigiriya", description: "Climb the Lion Rock, explore gardens." },
      { day: 5, title: "Polonnaruwa", description: "Cycle through ancient ruins." },
      { day: 6, title: "Kandy", description: "Temple of the Tooth, cultural show." },
      { day: 7, title: "Nuwara Eliya", description: "Tea country and colonial hill station." },
      { day: 8, title: "Ella Train", description: "Legendary scenic train journey." },
      { day: 9, title: "Ella Exploration", description: "Nine Arch Bridge, waterfalls, hiking." },
      { day: 10, title: "Yala Safari", description: "Full-day wildlife safari." },
      { day: 11, title: "Mirissa", description: "Beach day and whale watching." },
      { day: 12, title: "Galle", description: "Fort exploration and coastal charm." },
      { day: 13, title: "Bentota", description: "Water sports and relaxation." },
      { day: 14, title: "Departure", description: "Transfer to Colombo airport." }
    ]
  }
];
