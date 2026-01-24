import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { ShoppingBag, CreditCard, Package, AlertCircle } from 'lucide-react';
import { usePOS } from '../context/POSContext';



const StatCard: React.FC<{ title: string, value: string, icon: any, trend: string, color: string }> = ({ title, value, icon: Icon, trend, color }) => (
    <div className="stat-card" style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ background: `${color}15`, padding: '10px', borderRadius: '12px' }}>
                <Icon size={24} color={color} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>{trend}</span>
        </div>
        <div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '4px' }}>{value}</h3>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { products, transactions } = usePOS();

    // Calculate aggregate stats
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalOrders = transactions.length;
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    const totalProducts = products.length;

    // Daily Sales chart data based on transactions
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const chartData = dayNames.map(day => {
        const dayTransactions = transactions.filter(t => {
            const date = new Date(t.date.split(' ')[0].split('/').reverse().join('-')); // handle DD/MM/YYYY
            return dayNames[date.getDay()] === day;
        });
        return {
            name: day,
            sales: dayTransactions.reduce((sum, t) => sum + t.total, 0),
            orders: dayTransactions.length
        };
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="flex-header">
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800' }}>Ringkasan Bisnis</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(var(--card-min-width, 240px), 1fr))', gap: '24px' }}>
                <StatCard title="Total Penjualan" value={`Rp ${totalRevenue.toLocaleString('id-ID')}`} icon={CreditCard} trend="+0%" color="var(--primary)" />
                <StatCard title="Total Pesanan" value={totalOrders.toString()} icon={ShoppingBag} trend="+0%" color="#a855f7" />
                <StatCard title="Total Produk" value={totalProducts.toString()} icon={Package} trend={`+${totalProducts}`} color="#10b981" />
                <StatCard title="Masalah Stok" value={lowStockCount.toString()} icon={AlertCircle} trend="Low Stock" color="#f59e0b" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                    <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Ringkasan Penjualan</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="sales" stroke="var(--primary)" fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                    <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Distribusi Pesanan</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
