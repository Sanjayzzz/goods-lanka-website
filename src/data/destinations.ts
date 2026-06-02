export interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  category: string;
  price?: number;
}

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Sigiriya",
    slug: "sigiriya",
    tagline: "The Lion Rock Fortress",
    description: "Rise above the ancient kingdom and witness the breathtaking 5th-century rock fortress, a UNESCO World Heritage Site surrounded by lush gardens and royal pools.",
    image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?w=800&q=80",
    rating: 4.9,
    reviewCount: 2847,
    highlights: ["UNESCO Heritage", "Ancient Frescoes", "Mirror Wall", "Royal Gardens"],
    category: "Cultural"
  },
  {
    id: "2",
    name: "Ella",
    slug: "ella",
    tagline: "Mountain Paradise",
    description: "Nestled in the misty highlands, Ella offers stunning views of tea plantations, waterfalls, and the iconic Nine Arch Bridge — a paradise for nature lovers.",
    image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80",
    rating: 4.8,
    reviewCount: 3126,
    highlights: ["Nine Arch Bridge", "Little Adam's Peak", "Tea Plantations", "Ravana Falls"],
    category: "Nature"
  },
  {
    id: "3",
    name: "Kandy",
    slug: "kandy",
    tagline: "Cultural Capital",
    description: "Explore Sri Lanka's cultural heart — home to the sacred Temple of the Tooth, scenic Kandy Lake, and vibrant Kandyan dance traditions.",
    image: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=800&q=80",
    rating: 4.7,
    reviewCount: 2534,
    highlights: ["Temple of the Tooth", "Kandy Lake", "Royal Botanical Gardens", "Cultural Shows"],
    category: "Cultural"
  },
  {
    id: "4",
    name: "Mirissa",
    slug: "mirissa",
    tagline: "Tropical Beach Haven",
    description: "Pristine golden beaches, turquoise waters, and world-class whale watching — Mirissa is the ultimate tropical beach escape on Sri Lanka's southern coast.",
    image: "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80",
    rating: 4.8,
    reviewCount: 1967,
    highlights: ["Whale Watching", "Coconut Tree Hill", "Secret Beach", "Surf Breaks"],
    category: "Beach"
  },
  {
    id: "5",
    name: "Galle",
    slug: "galle",
    tagline: "Colonial Charm",
    description: "Wander through the UNESCO-listed Galle Fort, where Dutch colonial architecture meets vibrant cafés, boutiques, and ocean-side sunsets.",
    image: "https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=800&q=80",
    rating: 4.7,
    reviewCount: 2203,
    highlights: ["Galle Fort", "Dutch Architecture", "Lighthouse", "Boutique Shopping"],
    category: "Cultural"
  },
  {
    id: "6",
    name: "Nuwara Eliya",
    slug: "nuwara-eliya",
    tagline: "Little England",
    description: "Experience the cool mountain climate, endless tea estates, and colonial charm of Sri Lanka's hill country — a refreshing escape from tropical heat.",
    image: "https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=800&q=80",
    rating: 4.6,
    reviewCount: 1845,
    highlights: ["Tea Estates", "Gregory Lake", "Horton Plains", "Strawberry Farms"],
    category: "Nature"
  },
  {
    id: "7",
    name: "Yala",
    slug: "yala",
    tagline: "Wildlife Kingdom",
    description: "Home to the highest leopard density in the world, Yala National Park offers thrilling safaris through diverse ecosystems teeming with wildlife.",
    image: "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?w=800&q=80",
    rating: 4.8,
    reviewCount: 2678,
    highlights: ["Leopard Safari", "Elephant Herds", "Bird Watching", "Coastal Wilderness"],
    category: "Wildlife"
  },
  {
    id: "8",
    name: "Arugam Bay",
    slug: "arugam-bay",
    tagline: "Surfer's Paradise",
    description: "World-renowned surf breaks, laid-back vibes, and stunning east coast beaches make Arugam Bay the ultimate destination for surf enthusiasts.",
    image: "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80",
    rating: 4.7,
    reviewCount: 1423,
    highlights: ["World-Class Surfing", "Beach Culture", "Lagoon Safari", "Kumana Park"],
    category: "Beach"
  },
  {
    id: "9",
    name: "Bentota",
    slug: "bentota",
    tagline: "Luxury Coastal Retreat",
    description: "Golden beaches, luxury resorts, and thrilling water sports — Bentota is Sri Lanka's premier coastal destination for relaxation and adventure.",
    image: "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80",
    rating: 4.6,
    reviewCount: 1756,
    highlights: ["Water Sports", "River Safari", "Turtle Hatchery", "Luxury Resorts"],
    category: "Beach"
  },
  {
    id: "10",
    name: "Colombo",
    slug: "colombo",
    tagline: "Vibrant Capital",
    description: "Sri Lanka's dynamic capital blends modern luxury with colonial heritage — world-class dining, shopping, and a vibrant nightlife scene await.",
    image: "https://images.unsplash.com/photo-1623595289196-007a22dd8560?w=800&q=80",
    rating: 4.5,
    reviewCount: 3456,
    highlights: ["Gangaramaya Temple", "Galle Face Green", "Fine Dining", "Shopping"],
    category: "Urban"
  }
];
