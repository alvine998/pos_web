import React, { useState } from 'react';
import type { Product } from '../data/dummyData';
import { usePOS } from '../context/POSContext';
import { useToast } from '../context/ToastContext';
import { Plus, Search, Edit3, Trash2, Package, Tag, Hash, LayoutGrid, Image as ImageIcon, X } from 'lucide-react';

const Products: React.FC = () => {
    const { products, setProducts, categories } = usePOS();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    // CRUD States
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        barcode: '',
        category: 'Kopi',
        price: 0,
        cost: 0,
        minStock: 5,
        image: '📦'
    });

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditProduct(product);
            setFormData({
                name: product.name,
                sku: product.sku,
                barcode: product.barcode,
                category: product.category,
                price: product.price,
                cost: product.cost,
                minStock: product.minStock,
                image: product.image
            });
        } else {
            setEditProduct(null);
            setFormData({
                name: '',
                sku: `PRD-${Date.now().toString().slice(-4)}`,
                barcode: '',
                category: 'Kopi',
                price: 0,
                cost: 0,
                minStock: 5,
                image: '📦'
            });
        }
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.price) {
            showToast('Nama dan Harga Jual wajib diisi', 'warning');
            return;
        }

        const newProduct: Product = {
            id: editProduct ? editProduct.id : Date.now(),
            ...formData,
            margin: formData.price - formData.cost,
            stock: editProduct ? editProduct.stock : 0,
            variants: editProduct ? editProduct.variants : [],
            units: editProduct ? editProduct.units : [{ type: 'pcs', multiplier: 1 }]
        };

        if (editProduct) {
            setProducts(prev => prev.map(p => p.id === editProduct.id ? newProduct : p));
            showToast('Produk berhasil diperbarui', 'success');
        } else {
            setProducts(prev => [newProduct, ...prev]);
            showToast('Produk baru berhasil ditambahkan', 'success');
        }
        setShowModal(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Hapus produk ini?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast('Produk telah dihapus', 'info');
        }
    };

    const filteredProducts = products.filter(p =>
        (selectedCategory === 'Semua' || p.category === selectedCategory) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="flex-header">
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800' }}>Manajemen Produk</h2>
                <button
                    onClick={() => handleOpenModal()}
                    style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <Plus size={20} /> Tambah Produk
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                {[
                    { label: 'Total Produk', value: products.length, icon: Package, color: '#3b82f6' },
                    { label: 'Kategori', value: categories.length - 1, icon: LayoutGrid, color: '#8b5cf6' },
                    { label: 'Stok Menipis', value: products.filter(p => p.stock <= p.minStock).length, icon: Tag, color: '#ef4444' }
                ].map((stat, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: `${stat.color}15`, color: stat.color, padding: '12px', borderRadius: '16px' }}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="filter-bar" style={{ background: 'white', padding: '20px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                <div style={{ position: 'relative', flex: '1 1 300px' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                    <input
                        type="text"
                        placeholder="Cari Nama atau SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ flex: '1 1 150px', padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '500' }}
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {/* Desktop Table View */}
            <div style={{ background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow)', overflow: 'hidden' }} className="table-container desktop-only">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Produk</th>
                            <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>SKU / Barcode</th>
                            <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Kategori</th>
                            <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Harga Jual</th>
                            <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Modal</th>
                            <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Margin</th>
                            <th style={{ padding: '20px 24px', fontWeight: '600', color: '#64748b' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                            {product.image}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '600' }}>{product.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{product.variants.length} Varian</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.875rem' }}>
                                            <Hash size={14} /> {product.sku}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.875rem' }}>
                                            <ImageIcon size={14} /> {product.barcode}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <span style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500' }}>
                                        {product.category}
                                    </span>
                                </td>
                                <td style={{ padding: '20px 24px', fontWeight: '600' }}>Rp {product.price.toLocaleString('id-ID')}</td>
                                <td style={{ padding: '20px 24px', color: '#64748b' }}>Rp {product.cost.toLocaleString('id-ID')}</td>
                                <td style={{ padding: '20px 24px', color: '#10b981', fontWeight: '600' }}>Rp {product.margin.toLocaleString('id-ID')}</td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => handleOpenModal(product)}
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer' }}
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredProducts.map(product => (
                    <div key={product.id} style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                {product.image}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>{product.name}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{product.category} • {product.sku}</p>
                                <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600', marginTop: '2px' }}>Stock: {product.stock}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>Rp {product.price.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                            <button
                                onClick={() => handleOpenModal(product)}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}
                            >
                                <Edit3 size={16} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600' }}
                            >
                                <Trash2 size={16} /> Hapus
                            </button>
                        </div>
                    </div>
                ))}
                {filteredProducts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                        <p>Tidak ada produk ditemukan</p>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', width: '600px', borderRadius: '32px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '32px' }}>{editProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>

                        <div className="responsive-modal-grid">
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Nama Produk</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Kopi Susu"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Kategori</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}
                                >
                                    {categories.filter(c => c !== 'Semua').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>SKU</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Barcode</label>
                                <input
                                    type="text"
                                    value={formData.barcode}
                                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                    placeholder="899..."
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Harga Jual (Rp)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Harga Modal (Rp)</label>
                                <input
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Minimum Stok</label>
                                <input
                                    type="number"
                                    value={formData.minStock}
                                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Ikon / Emoji</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', padding: '20px', background: '#f0fdf4', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: '#166534' }}>Estimasi Margin</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#166534' }}>Rp {(formData.price - formData.cost).toLocaleString('id-ID')}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.875rem', color: '#166534' }}>Margin (%)</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#166534' }}>{formData.price > 0 ? Math.round(((formData.price - formData.cost) / formData.price) * 100) : 0}%</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '32px' }}
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
