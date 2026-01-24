import React, { useState } from 'react';
import { Download, TrendingUp, DollarSign, Package, Users, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import { usePOS } from '../context/POSContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';

const Reports: React.FC = () => {
    const { transactions, cashFlow } = usePOS();
    const [activeTab, setActiveTab] = useState('Penjualan');

    // Analytics Calculations
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalProfit = transactions.reduce((sum, t) => sum + t.profit, 0);
    const totalOrders = transactions.length;

    const productSales: any = {};
    transactions.forEach(t => {
        t.items.forEach(item => {
            productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
    });
    const bestSellers = Object.keys(productSales).map(name => ({ name, value: productSales[name] })).sort((a, b) => b.value - a.value);

    const cashierReport: any = {};
    transactions.forEach(t => {
        cashierReport[t.cashier] = (cashierReport[t.cashier] || 0) + t.total;
    });
    const cashierData = Object.keys(cashierReport).map(name => ({ name, total: cashierReport[name] }));

    const handleExportExcel = () => {
        let dataToExport: any[] = [];
        let fileName = 'Laporan';

        if (activeTab === 'Penjualan') {
            dataToExport = transactions;
            fileName = 'Laporan_Penjualan';
        } else if (activeTab === 'Arus Kas') {
            dataToExport = cashFlow;
            fileName = 'Laporan_Arus_Kas';
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const tabs = ['Penjualan', 'Produk Terlaris', 'Laba Rugi', 'Arus Kas', 'Kasir'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="flex-header">
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800' }}>Laporan & Analitik</h2>
                <button
                    onClick={handleExportExcel}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
                >
                    <Download size={20} /> Export Excel
                </button>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                    <div style={{ color: 'var(--primary)', marginBottom: '12px' }}><DollarSign size={24} /></div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>Pendapatan Bersih</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rp {totalRevenue.toLocaleString('id-ID')}</h3>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                    <div style={{ color: '#10b981', marginBottom: '12px' }}><TrendingUp size={24} /></div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>Total Laba (Gross)</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rp {totalProfit.toLocaleString('id-ID')}</h3>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                    <div style={{ color: '#8b5cf6', marginBottom: '12px' }}><Package size={24} /></div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>Total Pesanan</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalOrders}</h3>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '16px', alignSelf: 'flex-start', maxWidth: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px', borderRadius: '12px', border: 'none',
                            background: activeTab === tab ? 'white' : 'transparent',
                            color: activeTab === tab ? 'var(--primary)' : '#64748b',
                            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: activeTab === tab ? '0 4px 6px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ background: 'white', borderRadius: '32px', padding: 'var(--content-padding, 32px)', boxShadow: 'var(--shadow)' }}>
                {activeTab === 'Penjualan' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h3 style={{ fontWeight: '700' }}>Daftar Transaksi Terbaru</h3>
                        <div className="table-container">
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '16px 0', color: '#64748b' }}>ID Transaksi</th>
                                        <th style={{ padding: '16px 0', color: '#64748b' }}>Waktu</th>
                                        <th style={{ padding: '16px 0', color: '#64748b' }}>Kasir</th>
                                        <th style={{ padding: '16px 0', color: '#64748b' }}>Metode</th>
                                        <th style={{ padding: '16px 0', color: '#64748b' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '16px 0', fontWeight: '600' }}>#{t.id}</td>
                                            <td style={{ padding: '16px 0', color: '#94a3b8' }}>{t.date}</td>
                                            <td style={{ padding: '16px 0' }}>{t.cashier}</td>
                                            <td style={{ padding: '16px 0' }}><span style={{ padding: '4px 8px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.8rem' }}>{t.type}</span></td>
                                            <td style={{ padding: '16px 0', fontWeight: '700', color: 'var(--primary)' }}>Rp {t.total.toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Produk Terlaris' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        <div>
                            <h3 style={{ fontWeight: '700', marginBottom: '24px' }}>Top 5 Produk</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {bestSellers.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>{idx + 1}</div>
                                            <span style={{ fontWeight: '600' }}>{item.name}</span>
                                        </div>
                                        <span style={{ fontWeight: '700' }}>{item.value} Terjual</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie data={bestSellers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                        {bestSellers.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'Laba Rugi' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '32px', fontWeight: '800' }}>Laporan Laba Rugi Sederhana</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                <span>Pendapatan Kotor (Sales)</span>
                                <span style={{ fontWeight: '600' }}>Rp {totalRevenue.toLocaleString('id-ID')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#ef4444' }}>
                                <span>HPP (Harga Pokok Penjualan)</span>
                                <span>- Rp {(totalRevenue - totalProfit).toLocaleString('id-ID')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f0fdf4', borderRadius: '12px', marginTop: '20px' }}>
                                <span style={{ fontWeight: '700' }}>Laba Kotor</span>
                                <span style={{ fontWeight: '800', color: '#166534' }}>Rp {totalProfit.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <p style={{ marginTop: '24px', fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>* HPP dihitung berdasarkan harga modal produk saat transaksi terjadi.</p>
                    </div>
                )}

                {activeTab === 'Arus Kas' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: '700' }}>Kas Masuk / Keluar</h3>
                            <button style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>+ Input Kas</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            {cashFlow.map(cf => (
                                <div key={cf.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ padding: '10px', borderRadius: '12px', background: cf.type === 'Masuk' ? '#dcfce7' : '#fee2e2', color: cf.type === 'Masuk' ? '#166534' : '#991b1b' }}>
                                        {cf.type === 'Masuk' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '700', fontSize: '1rem' }}>{cf.category}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{cf.date} • {cf.note}</p>
                                    </div>
                                    <span style={{ fontWeight: '700', color: cf.type === 'Masuk' ? '#10b981' : '#ef4444' }}>
                                        {cf.type === 'Masuk' ? '+' : '-'} Rp {cf.amount.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Kasir' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ fontWeight: '700' }}>Performa per Kasir</h3>
                            {cashierData.map((c, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#f8fafc', borderRadius: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#eff6ff', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} /></div>
                                        <span style={{ fontWeight: '600' }}>{c.name}</span>
                                    </div>
                                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Rp {c.total.toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cashierData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="total" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
