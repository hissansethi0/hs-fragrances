import { Product, Coupon, BlogPost } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Oud Royale',
    brand: 'HS Fragrances',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800'
    ],
    price: 12500,
    discountPrice: 9900,
    description: 'An opulent masterwork that marries the depth of dark Cambodian Oud with the sweet warmth of Madagascan vanilla and rich spices. Oud Royale is an atmospheric journey into absolute luxury, leaving a hypnotic and enduring trail.',
    fragranceNotes: {
      top: 'Saffron, Nutmeg, Lavender',
      heart: 'Natural Oud Wood, Patchouli',
      base: 'Musk, Sandalwood, Madagascan Vanilla'
    },
    category: 'Unisex',
    stockQuantity: 15,
    rating: 4.9,
    reviews: [
      { id: 'r1', user: 'Ahsan Khan', rating: 5, comment: 'The most majestic oud perfume I have ever owned. Lasts easily over 24 hours!', date: '2026-05-12' },
      { id: 'r2', user: 'Zara Ahmed', rating: 5, comment: 'Simply brilliant! A magical woody scent that is deeply refined.', date: '2026-06-01' }
    ],
    featured: true,
    bestSeller: true
  },
  {
    id: 'p2',
    name: 'Imperial Jasmine',
    brand: 'HS Fragrances',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585218356057-dc0e8d3558bb?auto=format&fit=crop&q=80&w=800'
    ],
    price: 9500,
    discountPrice: 8200,
    description: 'A breathtakingly fresh floral fragrance representing high-society elegance. Capturing the essence of night-blooming jasmine petals coated in early morning dew, blended seamlessly with delicate citrus and rich white musk.',
    fragranceNotes: {
      top: 'Bergamot, Neroli, Green Apple',
      heart: 'Imperial Jasmine, Bulgarian Rose, Orange Blossom',
      base: 'White Musk, Ambergris, Cashmere Wood'
    },
    category: 'Women',
    stockQuantity: 25,
    rating: 4.8,
    reviews: [
      { id: 'r3', user: 'Sadia Malik', rating: 5, comment: 'Extremely feminine, crisp, and fresh. Received so many compliments at a wedding last week!', date: '2026-05-20' }
    ],
    featured: true,
    bestSeller: false
  },
  {
    id: 'p3',
    name: 'Golden Amber',
    brand: 'HS Fragrances',
    images: [
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=800'
    ],
    price: 11000,
    discountPrice: null,
    description: 'A warm, radiant, and intoxicating blend designed for connoisseurs. Golden Amber unfurls with bright bergamot before wrapping you in a deeply sensual blanket of benzoin, pure labdanum, and velvety sweet vanilla.',
    fragranceNotes: {
      top: 'Amber, Italian Bergamot, Coriander',
      heart: 'Siam Benzoin, Labdanum, Patchouli',
      base: 'Bourbon Vanilla, Tonka Bean, Leather'
    },
    category: 'Unisex',
    stockQuantity: 18,
    rating: 4.7,
    reviews: [
      { id: 'r4', user: 'Bilal Sethi', rating: 4, comment: 'Warm, cozy, and highly luxurious. Ideal for winter or elegant evening dinners.', date: '2026-06-10' }
    ],
    featured: false,
    bestSeller: true
  },
  {
    id: 'p4',
    name: 'Noir Intense',
    brand: 'HS Fragrances',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800'
    ],
    price: 13000,
    discountPrice: 10500,
    description: 'A masculine, sophisticated statement of power and mystery. Noir Intense merges clean cardamom and smoky tobacco leaves with robust, dark leather and precious cedarwood for an unforgettable alpha presence.',
    fragranceNotes: {
      top: 'Cardamom, Pink Pepper, Grapefruit',
      heart: 'Tobacco Leaves, Cinnamon, Iris',
      base: 'Dark Leather, Vetiver, Cedarwood, Amber'
    },
    category: 'Men',
    stockQuantity: 10,
    rating: 5.0,
    reviews: [
      { id: 'r5', user: 'Haris Ali', rating: 5, comment: 'Absolutely masculine and dark. Projects like a beast. Highly recommend to everyone.', date: '2026-06-18' }
    ],
    featured: true,
    bestSeller: true
  },
  {
    id: 'p5',
    name: 'Rose Velvet',
    brand: 'HS Fragrances',
    images: [
      'https://images.unsplash.com/photo-1585218356057-dc0e8d3558bb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'
    ],
    price: 10500,
    discountPrice: 8900,
    description: 'An exquisite celebration of the Queen of Flowers. Crimson roses are enwrapped in luxury suede, dusty cocoa, and comforting pralines to form a warm, velvety, slightly gourmand floral that sings of romance.',
    fragranceNotes: {
      top: 'Red Rose, Cloves, Raspberry',
      heart: 'Damask Rose, Praline, Suede',
      base: 'Agarwood (Oud), Amber, Patchouli'
    },
    category: 'Women',
    stockQuantity: 20,
    rating: 4.6,
    reviews: [
      { id: 'r6', user: 'Ayesha Omer', rating: 4.5, comment: 'A lovely, sweet, deep rose scent. Perfectly sweet but extremely elegant.', date: '2026-04-30' }
    ],
    featured: false,
    bestSeller: false
  },
  {
    id: 'p6',
    name: 'Santal Mystic',
    brand: 'HS Fragrances',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800'
    ],
    price: 11500,
    discountPrice: 9400,
    description: 'Sandalwood reimagined in its purest, most spiritual form. Creamy Mysore sandalwood is blended with spicy cardamom, fresh papyrus, and leather to produce an enigmatic, atmospheric scent that is calm yet commanding.',
    fragranceNotes: {
      top: 'Violet, Cardamom, Papyrus',
      heart: 'Iris, Amber, Virginia Cedarwood',
      base: 'Mysore Sandalwood, Leather, Musk'
    },
    category: 'Unisex',
    stockQuantity: 12,
    rating: 4.8,
    reviews: [
      { id: 'r7', user: 'Usman Sethi', rating: 5, comment: 'Mysterious, earthy, and deep. It smells incredibly expensive and sophisticated.', date: '2026-06-22' }
    ],
    featured: false,
    bestSeller: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'LUXURY20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 8000,
    active: true
  },
  {
    id: 'c2',
    code: 'HSFRAGRANCE',
    discountType: 'fixed',
    discountValue: 1500,
    minPurchase: 10000,
    active: true
  },
  {
    id: 'c3',
    code: 'EIDSPECIAL',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 5000,
    active: true
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Art of Layering Fragrances: A Guide to Bespoke Scents',
    excerpt: 'Unlock the secret to a fully custom olfactory signature by mastering the delicate art of perfume layering.',
    content: 'Creating your own unique perfume blend is the ultimate statement of luxury. When you layer scents, you mix different notes to create a brand new profile. To do this successfully, start with a heavier base fragrance, such as Oud Royale or Santal Mystic, which contains strong base notes like sandalwood or oud. Let it settle on your skin for a few minutes, then spray a lighter floral or citrus fragrance, such as Imperial Jasmine, on top. The result is a gorgeous, multi-dimensional fragrance that is entirely yours.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    date: '2026-06-15',
    author: 'Hissan Sethi'
  },
  {
    id: 'b2',
    title: 'How to Make Your Luxury Perfume Last All Day & Night',
    excerpt: 'Discover the exact pulse points, prep routines, and storage habits that keep your fragrance projecting for 24+ hours.',
    content: 'Have you ever wondered why your premium perfumes seem to fade faster than expected? It often comes down to application and skin preparation. First, moisturize your skin before applying. Fragrance molecules bind to oils, so hydrated skin locks in scent far better than dry skin. Apply to key pulse points where your blood flows closest to the skin: the wrists, inner elbows, behind the ears, and at the base of your throat. Crucially, never rub your wrists together! This friction crushes the delicate top notes, causing them to dissipate instantly. Store your precious bottles in dry, dark places, away from bathroom humidity, to keep the fragrance ingredients pristine.',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
    date: '2026-06-20',
    author: 'Hissan Sethi'
  }
];

export const FAQS = [
  {
    question: 'Are your fragrances original and long-lasting?',
    answer: 'Absolutely. Every fragrance at HS Fragrances is meticulously formulated using high concentrations of premium French oils, ensuring a projection of 8 to 12 hours on skin and up to 24+ hours on fabrics.'
  },
  {
    question: 'What payment methods do you support?',
    answer: 'We support Easypaisa, JazzCash, Direct Bank Transfer, and Cash on Delivery (COD) across Pakistan. Our JazzCash official merchant account number is 03369296853.'
  },
  {
    question: 'How do I track my order?',
    answer: 'When you place an order, you will receive a unique Order ID (e.g., #HS-1049). You can paste this ID into our "Track Order" page to see its real-time processing status (Pending, Confirmed, Shipped, or Delivered).'
  },
  {
    question: 'Can I cancel or exchange my perfume?',
    answer: 'Due to hygiene and the artisanal nature of luxury perfumery, we offer exchanges only if the product is defective, damaged during shipping, or remains completely sealed. Please reach out to us at hissansethi0@gmail.com or 03133492982 for support.'
  }
];
