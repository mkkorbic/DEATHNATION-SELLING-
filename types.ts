
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled'
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  theme: {
    primary: string;
    accent: string;
    logoUrl: string;
  };
}

export interface Attribute {
  id: string;
  name: string;
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  value: string;
}

export interface Variant {
  id: string;
  sku: string;
  price?: number;
  stock: number;
  attributeValues: Record<string, string>; // attributeId -> valueId
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: string;
  badge?: 'NEW' | 'SALE' | 'LIMITED';
  images: string[];
  attributes: Attribute[];
  attributeValues: AttributeValue[];
  variants: Variant[];
  isActive: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  priceSnapshot: number;
  product: Product;
  selectedVariant?: Variant;
}

export interface Order {
  id: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  items: CartItem[];
  createdAt: string;
  trackingNumber?: string;
}

export type AppView = 'STORE' | 'ADMIN' | 'ACCOUNT' | 'CHECKOUT';
