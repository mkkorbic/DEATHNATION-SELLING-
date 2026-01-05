
import { Store, Product } from './types';

export const CURRENT_STORE: Store = {
  id: 'store-1',
  name: 'Death Nation',
  slug: 'death-nation',
  theme: {
    primary: '#09090b', // Zinc 950
    accent: '#ef4444',  // Red 500
    logoUrl: 'https://picsum.photos/seed/deathnation/200/200'
  }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    storeId: 'store-1',
    name: 'Grim Reaper Tee',
    slug: 'grim-reaper-tee',
    description: 'A heavyweight premium cotton tee with high-quality screen printed graphics on the front and back. Designed for the bold.',
    basePrice: 35.00,
    currency: 'USD',
    badge: 'NEW',
    isActive: true,
    images: [
      'https://picsum.photos/seed/tee1/600/800',
      'https://picsum.photos/seed/tee1back/600/800'
    ],
    attributes: [
      { id: 'a1', name: 'Size' },
      { id: 'a2', name: 'Color' }
    ],
    attributeValues: [
      { id: 'v1', attributeId: 'a1', value: 'S' },
      { id: 'v2', attributeId: 'a1', value: 'M' },
      { id: 'v3', attributeId: 'a1', value: 'L' },
      { id: 'v4', attributeId: 'a1', value: 'XL' },
      { id: 'v5', attributeId: 'a2', value: 'Pitch Black' },
      { id: 'v6', attributeId: 'a2', value: 'Blood Red' }
    ],
    variants: [
      { id: 'var1', sku: 'DN-GR-S-BLK', stock: 50, attributeValues: { 'a1': 'v1', 'a2': 'v5' } },
      { id: 'var2', sku: 'DN-GR-M-BLK', stock: 120, attributeValues: { 'a1': 'v2', 'a2': 'v5' } },
      { id: 'var3', sku: 'DN-GR-L-BLK', stock: 0, attributeValues: { 'a1': 'v3', 'a2': 'v5' } },
      { id: 'var4', sku: 'DN-GR-S-RED', stock: 20, attributeValues: { 'a1': 'v1', 'a2': 'v6' }, price: 38.00 }
    ]
  },
  {
    id: 'p2',
    storeId: 'store-1',
    name: 'Skull Emissary Hoodie',
    slug: 'skull-hoodie',
    description: 'Limited edition oversized hoodie. Features intricate embroidery and a brushed fleece interior.',
    basePrice: 65.00,
    currency: 'USD',
    badge: 'LIMITED',
    isActive: true,
    images: [
      'https://picsum.photos/seed/hoodie1/600/800',
      'https://picsum.photos/seed/hoodie2/600/800'
    ],
    attributes: [{ id: 'a1', name: 'Size' }],
    attributeValues: [
      { id: 'v1', attributeId: 'a1', value: 'S' },
      { id: 'v2', attributeId: 'a1', value: 'M' },
      { id: 'v3', attributeId: 'a1', value: 'L' }
    ],
    variants: [
      { id: 'var5', sku: 'DN-SH-S', stock: 15, attributeValues: { 'a1': 'v1' } },
      { id: 'var6', sku: 'DN-SH-M', stock: 25, attributeValues: { 'a1': 'v2' } }
    ]
  },
  {
    id: 'p3',
    storeId: 'store-1',
    name: 'Underworld Cargo Pants',
    slug: 'cargo-pants',
    description: 'Tactical cargo pants with multi-pocket system and adjustable straps. Built for survival.',
    basePrice: 85.00,
    currency: 'USD',
    badge: 'SALE',
    isActive: true,
    images: [
      'https://picsum.photos/seed/pants1/600/800'
    ],
    attributes: [{ id: 'a1', name: 'Size' }],
    attributeValues: [
      { id: 'v1', attributeId: 'a1', value: '30' },
      { id: 'v2', attributeId: 'a1', value: '32' },
      { id: 'v3', attributeId: 'a1', value: '34' }
    ],
    variants: [
      { id: 'var7', sku: 'DN-UC-30', stock: 10, attributeValues: { 'a1': 'v1' } },
      { id: 'var8', sku: 'DN-UC-32', stock: 15, attributeValues: { 'a1': 'v2' } }
    ]
  }
];
