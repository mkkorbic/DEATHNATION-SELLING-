
import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  Minus,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Product, CartItem, Variant } from '../types';
import { MOCK_PRODUCTS, CURRENT_STORE } from '../constants';
import { getShoppingAdvice } from '../services/gemini';

interface StoreFrontProps {
  onGoToAdmin: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, q: number) => void;
}

export const StoreFront: React.FC<StoreFrontProps> = ({ 
  onGoToAdmin, 
  cart, 
  addToCart,
  removeFromCart,
  updateCartQuantity
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.priceSnapshot * item.quantity), 0), [cart]);

  const handleAskAi = async () => {
    if (!aiQuery) return;
    setIsAiLoading(true);
    setAiResponse(null);
    const advice = await getShoppingAdvice(aiQuery, MOCK_PRODUCTS);
    setAiResponse(advice);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <button className="md:hidden"><Menu /></button>
          <h1 className="font-brand text-3xl tracking-tighter cursor-pointer" onClick={() => setSelectedProduct(null)}>
            {CURRENT_STORE.name.toUpperCase()}
          </h1>
          <div className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-widest text-zinc-500">
            <a href="#" className="hover:text-black transition">Shop All</a>
            <a href="#" className="hover:text-black transition">New Arrivals</a>
            <a href="#" className="hover:text-black transition">Collections</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-zinc-500 hover:text-black" onClick={onGoToAdmin}>Admin</button>
          <div className="h-6 w-px bg-zinc-200"></div>
          <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2 group">
            <ShoppingBag className="group-hover:scale-110 transition" />
            <span className="hidden md:inline font-bold text-sm">{cart.length}</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero */}
      {!selectedProduct && (
        <section className="relative h-[70vh] bg-zinc-900 flex items-center justify-center overflow-hidden">
          <img 
            src="https://picsum.photos/seed/deathhero/1920/1080" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" 
          />
          <div className="relative z-10 text-center text-white p-6">
            <h2 className="font-brand text-7xl md:text-9xl mb-4 tracking-tighter">THE END IS NEAR</h2>
            <p className="text-xl md:text-2xl mb-8 font-light tracking-widest uppercase italic">Winter Collection Out Now</p>
            <button className="px-8 py-4 bg-white text-zinc-950 font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
              Explore Collection
            </button>
          </div>
        </section>
      )}

      {/* Main Grid */}
      <main className="flex-1 p-6 md:p-12">
        {selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
            onAddToCart={addToCart}
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {MOCK_PRODUCTS.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => setSelectedProduct(product)} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <header className="p-6 border-b border-zinc-200 flex justify-between items-center">
              <h3 className="font-brand text-2xl uppercase tracking-widest">Your Bag ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)}><X /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
                  <ShoppingBag size={48} />
                  <p>Your bag is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.product.images[0]} alt="" className="w-20 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex justify-between font-bold text-sm mb-1 uppercase tracking-tight">
                        <h4>{item.product.name}</h4>
                        <span>${(item.priceSnapshot * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-4">
                        {item.selectedVariant && Object.entries(item.selectedVariant.attributeValues).map(([attrId, valId]) => {
                          const attr = item.product.attributes.find(a => a.id === attrId);
                          const val = item.product.attributeValues.find(v => v.id === valId);
                          return `${attr?.name}: ${val?.value}`;
                        }).join(' / ')}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-zinc-200 rounded">
                          <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-zinc-50"><Minus size={14} /></button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-zinc-50"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase font-bold text-zinc-400 hover:text-red-600 transition">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <footer className="p-6 border-t border-zinc-200 space-y-4">
                <div className="flex justify-between font-bold text-lg uppercase">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-zinc-500">Shipping and taxes calculated at checkout.</p>
                <button className="w-full py-4 bg-zinc-950 text-white font-bold uppercase tracking-widest hover:bg-zinc-800 transition shadow-xl">
                  Checkout Now
                </button>
              </footer>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {isAiOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 border border-zinc-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <header className="bg-zinc-950 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span className="font-bold text-sm tracking-widest uppercase">Shopping Assistant</span>
              </div>
              <button onClick={() => setIsAiOpen(false)}><X size={18} /></button>
            </header>
            <div className="h-80 overflow-y-auto p-4 bg-zinc-50 space-y-4">
              <div className="bg-white p-3 rounded-lg border border-zinc-100 text-sm">
                Hey, I'm the Death Nation AI. Looking for something specific to wear to the abyss? Ask me anything about our gear.
              </div>
              {aiResponse && (
                <div className="bg-zinc-950 text-white p-3 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">
                  {aiResponse}
                </div>
              )}
              {isAiLoading && <div className="text-xs text-zinc-400 italic">Thinking...</div>}
            </div>
            <div className="p-4 border-t border-zinc-100 flex gap-2">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                placeholder="Suggest a fit..." 
                className="flex-1 bg-zinc-100 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-950 outline-none"
              />
              <button 
                onClick={handleAskAi}
                className="bg-zinc-950 text-white p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                disabled={isAiLoading}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAiOpen(true)}
            className="bg-zinc-950 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition active:scale-95 flex items-center justify-center group"
          >
            <MessageSquare />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold text-xs uppercase tracking-widest ml-0 group-hover:ml-2">
              Ask AI
            </span>
          </button>
        )}
      </div>

      <footer className="bg-zinc-950 text-white p-12 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h4 className="font-brand text-3xl tracking-tighter">DEATH NATION</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">Modern streetwear for those who live life on the edge. Established 2024.</p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold uppercase text-xs tracking-widest">Shop</h5>
            <ul className="text-zinc-500 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition">Sale</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold uppercase text-xs tracking-widest">Support</h5>
            <ul className="text-zinc-500 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold uppercase text-xs tracking-widest">Newsletter</h5>
            <p className="text-zinc-500 text-sm">Join the abyss. Get early access to drops.</p>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-zinc-900 border-zinc-800 text-white px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-zinc-700" />
              <button className="bg-white text-black px-4 font-bold uppercase text-xs">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product, onClick: () => void }> = ({ product, onClick }) => {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-zinc-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest shadow-lg">
            {product.badge}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-sm uppercase tracking-tight group-hover:underline">{product.name}</h3>
        <p className="text-sm font-medium text-zinc-500">${product.basePrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

const ProductDetail: React.FC<{ product: Product, onBack: () => void, onAddToCart: (i: CartItem) => void }> = ({ product, onBack, onAddToCart }) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const matchingVariant = useMemo(() => {
    return product.variants.find(v => {
      return Object.entries(v.attributeValues).every(([attrId, valId]) => {
        return selectedVariants[attrId] === valId;
      });
    });
  }, [selectedVariants, product.variants]);

  const canAdd = product.attributes.length === Object.keys(selectedVariants).length;
  const price = matchingVariant?.price || product.basePrice;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm uppercase font-bold text-zinc-400 hover:text-black transition">
        <ChevronRight className="rotate-180" size={16} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          {product.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full aspect-[3/4] object-cover bg-zinc-100 rounded" />
          ))}
        </div>

        <div className="space-y-10 md:sticky md:top-32 h-fit">
          <div className="space-y-4">
            <h1 className="font-brand text-6xl tracking-tighter uppercase leading-none">{product.name}</h1>
            <p className="text-2xl font-medium text-zinc-500 italic font-serif">${price.toFixed(2)}</p>
            <p className="text-zinc-600 leading-relaxed text-sm md:text-base">{product.description}</p>
          </div>

          <div className="space-y-8">
            {product.attributes.map(attr => (
              <div key={attr.id} className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex justify-between">
                  Select {attr.name}
                  <span className="text-black">{selectedVariants[attr.id] ? product.attributeValues.find(v => v.id === selectedVariants[attr.id])?.value : 'Required'}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.attributeValues
                    .filter(v => v.attributeId === attr.id)
                    .map(val => {
                      const isSelected = selectedVariants[attr.id] === val.id;
                      return (
                        <button
                          key={val.id}
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [attr.id]: val.id }))}
                          className={`px-6 py-2 border text-sm font-bold transition-all uppercase tracking-widest
                            ${isSelected ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg scale-105' : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-950'}
                          `}
                        >
                          {val.value}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            {matchingVariant && matchingVariant.stock <= 0 ? (
              <button disabled className="w-full py-5 bg-zinc-200 text-zinc-400 font-bold uppercase tracking-widest cursor-not-allowed">
                Sold Out
              </button>
            ) : (
              <button 
                onClick={() => canAdd && onAddToCart({
                  id: Math.random().toString(36).substr(2, 9),
                  productId: product.id,
                  variantId: matchingVariant?.id,
                  quantity: 1,
                  priceSnapshot: price,
                  product,
                  selectedVariant: matchingVariant
                })}
                disabled={!canAdd}
                className="w-full py-5 bg-zinc-950 text-white font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
              >
                Add to Bag
              </button>
            )}
            <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest">Free Shipping on orders over $150</p>
          </div>
        </div>
      </div>
    </div>
  );
};
