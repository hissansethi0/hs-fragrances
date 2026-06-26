export type UserRole = 'Admin' | 'Editor' | 'Customer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface FragranceNotes {
  top: string;
  heart: string;
  base: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  images: string[];
  price: number;
  discountPrice: number | null;
  description: string;
  fragranceNotes: FragranceNotes;
  category: 'Men' | 'Women' | 'Unisex';
  stockQuantity: number;
  rating: number;
  reviews: Review[];
  featured?: boolean;
  bestSeller?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'Easypaisa' | 'JazzCash' | 'Bank Transfer' | 'Cash on Delivery';
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  couponUsed: string | null;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  active: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}
