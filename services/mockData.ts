import { Product, BlogPost } from '../types';

export const DATA_VERSION = 4;

export const mockProducts: Product[] = [
  { 
    id: 'velora-1', 
    name: '🌸 Velora – The Essence of Timeless Elegance Eau De Perfume', 
    description: 'Velora is the fragrance of memories wrapped in velvet whispers. It carries the grace of fleeting moments that stay forever etched in the heart — the laughter of a loved one, the touch of silk, the glow of a quiet evening.\n\nFloral blooms rise first, soft yet captivating, then melt into warm sensual notes before resting in a deep, lingering base. Velora is not just worn, it is remembered — like a memory that never fades.\n\n✨ Velora – Because elegance never shouts, it simply lingers.', 
    image: 'https://i.imgur.com/2R7Hrlt.png', 
    variants: [
      { id: 'velora-1-100', size: '100ml', price: 3500, discountedPrice: 2599, stock: 0 },
      { id: 'velora-1-50', size: '50ml', price: 2400, discountedPrice: 1799, stock: 0 },
    ]
  },
  { 
    id: 'draven-2', 
    name: '🖤 Draven – The Shadow of Elegance Signature Scent', 
    description: 'Draven is the memory of power, mystery, and allure. It recalls moments of strength — the echo of footsteps in silence, the warmth of a fire on a cold night, the magnetic presence that never goes unnoticed.\n\nThe fragrance strikes with sharp spice, deepens with smoky woods and leather, and rests in dark musks and oud. Every note is a memory of confidence and command.\n\n✨ Draven – Darkness never smelled this elegant.', 
    image: 'https://i.imgur.com/eqw9sgT.png',
    variants: [
      { id: 'draven-2-100', size: '100ml', price: 3200, discountedPrice: 2499, stock: 5 },
      { id: 'draven-2-50', size: '50ml', price: 2300, discountedPrice: 1699, stock: 5 },
    ]
  },
  { 
    id: 'auron-3', 
    name: '✨ Auron – The Power of Presence', 
    description: 'Auron is the memory of brilliance — the golden glow of dawn, the sparkle of ambition, the timeless presence of those who define their own path.\n\nFresh citrus awakens the senses, leading to velvety woods and florals, before settling into deep amber and musk. Neither masculine nor feminine, Auron is for the soul that belongs only to itself.\n\n✨ Auron – Because true luxury knows no gender.', 
    image: 'https://i.imgur.com/9B5MkpA.jpeg',
    variants: [
      { id: 'auron-3-100', size: '100ml', price: 2100, discountedPrice: 1999, stock: 0 },
      { id: 'auron-3-50', size: '50ml', price: 1800, discountedPrice: 1699, stock: 0 },
    ]
  },
];

export const mockBlogPosts: BlogPost[] = [
  { 
    id: '1', 
    title: 'Why Luxury Perfumes Like Velvet Nocturne Define Personality', 
    author: 'Velvet Nocturne Team', 
    date: 'December 5, 2023', 
    summary: 'Discover how luxury perfumes go beyond fragrance — expressing your personality, mood, and confidence. Explore how Velvet Nocturne’s signature scents like Velora, Draven, and Auron redefine elegance and individuality.', 
    content: 'In a world where first impressions speak louder than words, fragrance becomes your silent signature — a reflection of who you are before you even speak. A luxury perfume is not just a blend of scents; it’s an expression of personality, mood, and emotion. Among such creations, Velvet Nocturne stands as a symbol of class, confidence, and individuality.\n\n---\n\n1. Scent as an Identity\n\nEvery person has a natural aura — something that defines them even in silence. A perfume enhances that aura. When you wear a luxury fragrance like Velora or Draven, it doesn’t just smell good; it becomes a part of your identity.\nThe floral elegance of Velora speaks of grace and charm, while Draven reflects mystery and strength. That’s how a scent turns into a statement.\n\n---\n\n2. The Art Behind Luxury Perfume\n\nUnlike commercial body sprays, luxury perfumes are crafted with precision. Each note — top, heart, and base — is chosen to tell a story.\nFor example:\n\n- Velora opens with delicate florals, symbolizing timeless elegance.\n- Draven brings the depth of oud and amber, capturing masculine power.\n- Auron bridges both worlds — sophisticated and unisex, representing balance.\n\nEvery drop of Velvet Nocturne perfume is handcrafted to last, ensuring your fragrance lingers just like your presence.\n\n---\n\n3. Confidence in Every Note\n\nA good perfume doesn’t just make you smell amazing — it makes you feel unstoppable. Wearing a scent that matches your personality boosts self-esteem, whether you’re walking into a meeting, a date, or a silent moment of reflection.\nLuxury perfumes are designed not to shout, but to whisper power — subtly, beautifully.\n\n---\n\n4. Memory and Emotion\n\nFragrance is directly connected to memory. One scent can bring back moments, faces, and feelings. When someone smells your perfume later, they remember you. That’s why Velvet Nocturne perfumes are created to be unforgettable — turning scent into emotion, and emotion into legacy.\n\n---\n\n5. The Symbol of Taste and Individuality\n\nIn the end, a luxury perfume is not a product — it’s a personality you wear.\nChoosing Velora, Draven, or Auron is more than picking a fragrance. It’s about saying, “This is who I am.”\nEach bottle represents a different soul:\n\n- Velora – Feminine Grace\n- Draven – Bold Masculinity\n- Auron – Timeless Individuality\n\n---\n\n🌙 Conclusion\n\nLuxury perfumes like Velvet Nocturne go beyond smell — they define style, confidence, and memory. They become a part of your story, an invisible thread that connects your past, present, and the impression you leave behind.\n\n✨ Because true elegance is not seen — it’s sensed.',
    image: 'https://i.imgur.com/qE6kL8w.jpeg' 
  },
];