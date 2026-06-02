export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1", title: "10 Must-Visit Hidden Gems in Sri Lanka", slug: "hidden-gems-sri-lanka",
    excerpt: "Beyond the popular tourist trails lies a Sri Lanka few travelers ever see. Discover secret waterfalls, untouched beaches, and ancient villages.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    author: "GODS LANKA Team", date: "March 15, 2025", readTime: "8 min read", category: "Travel Guide"
  },
  {
    id: "2", title: "The Ultimate Sri Lankan Food Guide", slug: "sri-lankan-food-guide",
    excerpt: "From fiery curries to sweet treats, Sri Lankan cuisine is a feast for the senses. Here's everything you need to know about eating like a local.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    author: "GODS LANKA Team", date: "February 28, 2025", readTime: "6 min read", category: "Food & Culture"
  },
  {
    id: "3", title: "Ella to Kandy: The World's Most Scenic Train Ride", slug: "ella-kandy-train-ride",
    excerpt: "Blue vintage trains winding through emerald tea plantations and misty mountains — this is the train journey that dreams are made of.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    author: "GODS LANKA Team", date: "February 10, 2025", readTime: "5 min read", category: "Adventure"
  },
  {
    id: "4", title: "Wildlife Safari Guide: Spotting Leopards in Yala", slug: "yala-leopard-safari",
    excerpt: "Yala National Park has the highest leopard density in the world. Here's how to maximize your chances of an unforgettable sighting.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
    author: "GODS LANKA Team", date: "January 20, 2025", readTime: "7 min read", category: "Wildlife"
  },
  {
    id: "5", title: "Best Time to Visit Sri Lanka: A Month-by-Month Guide", slug: "best-time-visit-sri-lanka",
    excerpt: "Sri Lanka's diverse climate means there's always a perfect destination. Plan your trip with our comprehensive seasonal guide.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
    author: "GODS LANKA Team", date: "January 5, 2025", readTime: "10 min read", category: "Travel Tips"
  },
  {
    id: "6", title: "Surfing in Sri Lanka: Beginner to Pro Guide", slug: "surfing-sri-lanka-guide",
    excerpt: "From Arugam Bay's legendary waves to beginner-friendly breaks in Weligama, Sri Lanka is a surfer's paradise waiting to be explored.",
    image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&q=80",
    author: "GODS LANKA Team", date: "December 15, 2024", readTime: "6 min read", category: "Adventure"
  }
];
