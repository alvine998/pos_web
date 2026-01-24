import React, { useState } from 'react';
import type { StockMovement } from '../data/dummyData';
import { usePOS } from '../context/POSContext';
import { useToast } from '../context/ToastContext';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, AlertTriangle, History, Search, X } from 'lucide-react';

const Inventory: React.FC = () => {
    const { products, setProducts, movements, setMovements } = usePOS();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState<'Masuk' | 'Keluar' | 'Opname' | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number | ''>('');
    const [note, setNote] = useState('');

    const handleStockAction = () => {
        if (!selectedProductId || !quantity || !showModal) {
            showToast('Mohon isi semua data yang diperlukan', 'warning');
            return;
        }

        const qtyNum = Number(quantity);
        const newMovement: StockMovement = {
            id: `M-${Date.now()}`,
            productId: Number(selectedProductId),
            date: new Date().toISOString().split('T')[0],
            type: showModal,
            quantity: qtyNum,
            note: note || (showModal === 'Masuk' ? 'Restock' : showModal === 'Keluar' ? 'Penyesuaian Keluar' : 'Stock Opname')
        };

        // Update Products
        setProducts(prev => prev.map(p => {
            if (p.id === selectedProductId) {
                let newStock = p.stock;
                if (showModal === 'Masuk') newStock += qtyNum;
                else if (showModal === 'Keluar') newStock -= qtyNum;
                else if (showModal === 'Opname') newStock = qtyNum;
                return { ...p, stock: Math.max(0, newStock) };
            }
            return p;
        }));

        // Update Movements
        setMovements(prev => [newMovement, ...prev]);

        showToast(`Stok berhasil diperbarui: ${showModal}`, 'success');

        // Reset & Close
        setShowModal(null);
        setSelectedProductId('');
        setQuantity('');
        setNote('');
    };

    const filteredStock = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800' }}>Stok & Inventori</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowModal('Masuk')}
                        style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <ArrowUpRight size={20} /> Stok Masuk
                    </button>
                    <button
                        onClick={() => setShowModal('Keluar')}
                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <ArrowDownLeft size={20} /> Stok Keluar
                    </button>
                    <button
                        onClick={() => setShowModal('Opname')}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <RefreshCw size={20} /> Stock Opname
                    </button>
                </div>
            </div>

            {/* Critical Stock Alerts */}
            {products.filter(p => p.stock <= p.minStock).length > 0 && (
                <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '16px', color: '#9a3412' }}>
                    <div style={{ background: '#ffedd5', padding: '10px', borderRadius: '12px' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontWeight: '700' }}>Peringatan Stok Menipis!</h4>
                        <p style={{ fontSize: '0.875rem' }}>Terdapat {products.filter(p => p.stock <= p.minStock).length} produk yang hampir habis. Segera lakukan restock.</p>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                {/* Stock Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                        <input
                            type="text"
                            placeholder="Cari Produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}
                        />
                    </div>

                    <div style={{ background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow)', overflow: 'hidden' }} className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Produk</th>
                                    <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Stock</th>
                                    <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Unit</th>
                                    <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStock.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ fontSize: '1.25rem' }}>{p.image}</div>
                                                <div>
                                                    <p style={{ fontWeight: '600' }}>{p.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', fontWeight: '700', fontSize: '1.125rem' }}>{p.stock}</td>
                                        <td style={{ padding: '20px 24px', color: '#64748b' }}>{p.units[0].type}</td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                background: p.stock <= p.minStock ? '#fee2e2' : '#dcfce7',
                                                color: p.stock <= p.minStock ? '#ef4444' : '#10b981'
                                            }}>
                                                {p.stock <= p.minStock ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Log / Recent History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <History size={20} color="#64748b" />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Riwayat Pergerakan</h3>
                    </div>

                    <div style={{ background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {movements.map(m => {
                            const p = products.find(prod => prod.id === m.productId);
                            return (
                                <div key={m.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: m.type === 'Masuk' ? '#dcfce7' : m.type === 'Keluar' ? '#fee2e2' : '#f1f5f9',
                                        color: m.type === 'Masuk' ? '#10b981' : m.type === 'Keluar' ? '#ef4444' : '#64748b'
                                    }}>
                                        {m.type === 'Masuk' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p?.name}</span>
                                            <span style={{ fontWeight: '700', color: m.type === 'Masuk' ? '#10b981' : '#ef4444' }}>
                                                {m.type === 'Masuk' ? '+' : '-'}{m.quantity}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{m.date} • {m.note}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <button
                            onClick={() => setShowHistoryModal(true)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Lihat Semua Riwayat
                        </button>
                    </div>
                </div>
            </div>

            {/* History Modal */}
            {showHistoryModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', width: '800px', borderRadius: '32px', padding: '32px', position: 'relative', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <button onClick={() => setShowHistoryModal(false)} style={{ position: 'absolute', top: '32px', right: '32px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', zIndex: 10 }}>
                            <X size={24} />
                        </button>

                        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '24px' }}>Seluruh Riwayat Stok</h3>

                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 5 }}>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>Waktu</th>
                                        <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>Produk</th>
                                        <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>Tipe</th>
                                        <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>Jumlah</th>
                                        <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>Catatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movements.map(m => {
                                        const p = products.find(prod => prod.id === m.productId);
                                        return (
                                            <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px 24px', color: '#94a3b8', fontSize: '0.875rem' }}>{m.date}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ fontWeight: '600' }}>{p?.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p?.sku}</div>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700',
                                                        background: m.type === 'Masuk' ? '#dcfce7' : m.type === 'Keluar' ? '#fee2e2' : '#f1f5f9',
                                                        color: m.type === 'Masuk' ? '#166534' : m.type === 'Keluar' ? '#991b1b' : '#64748b'
                                                    }}>
                                                        {m.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontWeight: '700', color: m.type === 'Masuk' ? '#10b981' : '#ef4444' }}>
                                                    {m.type === 'Masuk' ? '+' : '-'}{m.quantity}
                                                </td>
                                                <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.875rem' }}>{m.note}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', width: '400px', borderRadius: '24px', padding: '32px', position: 'relative' }}>
                        <button onClick={() => setShowModal(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>Stok {showModal}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Pilih Produk</label>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}
                                >
                                    <option value="">Pilih Produk...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                                    {showModal === 'Opname' ? 'Stok Aktual' : 'Jumlah'}
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder="0"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Catatan</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Opsional..."
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '80px', fontFamily: 'inherit' }}
                                />
                            </div>

                            <button
                                onClick={handleStockAction}
                                style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', marginTop: '12px' }}
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
