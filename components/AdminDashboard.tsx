
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  BarChart3, 
  Plus, 
  MoreVertical,
  Truck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Product, Order, OrderStatus } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const mockSalesData = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 300 },
  { name: 'Wed', sales: 600 },
  { name: 'Thu', sales: 800 },
  { name: 'Fri', sales: 500 },
  { name: 'Sat', sales: 1200 },
  { name: 'Sun', sales: 900 },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-12345',
      storeId: 'store-1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      total: 135.00,
      status: OrderStatus.PAID,
      items: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 'ORD-12346',
      storeId: 'store-1',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      total: 65.00,
      status: OrderStatus.SHIPPED,
      items: [],
      createdAt: new Date().toISOString(),
      trackingNumber: 'SHIPPO-123'
    }
  ]);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="flex h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold">DN</div>
          <span className="font-bold tracking-tight">PLATFORM ADMIN</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
          >
            <LayoutDashboard size={20} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'products' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
          >
            <Package size={20} /> Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'orders' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
          >
            <ShoppingCart size={20} /> Orders
          </button>
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-6">
          <button className="flex items-center gap-3 p-3 text-zinc-400 hover:text-white transition w-full text-left">
            <Settings size={20} /> Store Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition shadow-sm">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-zinc-950 text-white rounded-lg hover:bg-zinc-800 transition shadow-lg flex items-center gap-2">
              <Plus size={18} /> New Product
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: '$12,450', change: '+12.5%', icon: <BarChart3 className="text-emerald-500" /> },
                { label: 'Orders', value: '156', change: '+8.2%', icon: <ShoppingCart className="text-blue-500" /> },
                { label: 'Avg Order Value', value: '$79.80', change: '-2.1%', icon: <Package className="text-amber-500" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-zinc-500 text-sm font-medium">{stat.label}</span>
                    {stat.icon}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className={`text-xs ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
              <h3 className="font-bold mb-6">Revenue Overview (7 Days)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#fafafa' }} />
                    <Bar dataKey="sales" fill="#18181b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Product</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Status</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Price</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Stock</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {MOCK_PRODUCTS.map(product => (
                  <tr key={product.id} className="hover:bg-zinc-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded-md" />
                        <div>
                          <p className="font-bold">{product.name}</p>
                          <p className="text-xs text-zinc-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Active</span>
                    </td>
                    <td className="p-4 font-medium">${product.basePrice.toFixed(2)}</td>
                    <td className="p-4 text-zinc-500">
                      {product.variants.reduce((acc, v) => acc + v.stock, 0)} units
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-zinc-400 hover:text-zinc-900"><MoreVertical size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Order ID</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Customer</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Status</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Total</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-50">
                    <td className="p-4 font-mono text-sm">{order.id}</td>
                    <td className="p-4">
                      <p className="font-bold">{order.customerName}</p>
                      <p className="text-xs text-zinc-500">{order.customerEmail}</p>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2 py-1 rounded border-0 outline-none
                          ${order.status === OrderStatus.PAID ? 'bg-blue-100 text-blue-700' : ''}
                          ${order.status === OrderStatus.SHIPPED ? 'bg-amber-100 text-amber-700' : ''}
                          ${order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' : ''}
                        `}
                      >
                        {Object.values(OrderStatus).map(s => (
                          <option key={s} value={s}>{s.toUpperCase()}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      {order.trackingNumber ? (
                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                          <Truck size={16} /> {order.trackingNumber}
                        </div>
                      ) : (
                        <button className="text-xs bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200 hover:bg-zinc-200">
                          Ship Now (Shippo)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
