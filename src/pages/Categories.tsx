import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { useToast } from '../context/ToastContext';
import { Plus, Search, Edit3, Trash2, LayoutGrid, X } from 'lucide-react';

const Categories: React.FC = () => {
    const { categories, setCategories } = usePOS();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const displayCategories = categories.filter(c => c !== 'Semua');
    const filteredCategories = displayCategories.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSave = () => {
        if (!newCategoryName) return;
        if (editCategory) {
            setCategories(prev => prev.map(c => c === editCategory ? newCategoryName : c));
            showToast('Kategori berhasil diperbarui', 'success');
        } else {
            setCategories(prev => [...prev, newCategoryName]);
            showToast('Kategori baru berhasil ditambahkan', 'success');
        }
        setShowModal(false);
        setNewCategoryName('');
        setEditCategory(null);
    };

    const handleEdit = (cat: string) => {
        setEditCategory(cat);
        setNewCategoryName(cat);
        setShowModal(true);
    };

    const handleDelete = (cat: string) => {
        if (window.confirm(`Hapus kategori "${cat}"?`)) {
            setCategories(prev => prev.filter(c => c !== cat));
            showToast('Kategori telah dihapus', 'info');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="flex-header">
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800' }}>Kelola Kategori</h2>
                <button
                    onClick={() => { setEditCategory(null); setNewCategoryName(''); setShowModal(true); }}
                    style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <Plus size={20} /> Tambah Kategori
                </button>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Search size={20} color="#94a3b8" />
                <input
                    type="text"
                    placeholder="Cari kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {filteredCategories.map((cat, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', background: '#eff6ff', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LayoutGrid size={24} />
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>{cat}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEdit(cat)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer' }}><Edit3 size={18} /></button>
                            <button onClick={() => handleDelete(cat)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '16px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '32px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>{editCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Nama Kategori</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Misal: Minuman Hangat"
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '8px' }}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', marginTop: '24px' }}
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
