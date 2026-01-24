import React from 'react';
import { ChevronLeft, Plus, User, Trash2, Edit3, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

interface Staff {
    id: number;
    name: string;
    role: string;
    status: 'Aktif' | 'Non-aktif';
    email: string;
}

const StaffManagement: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [staffList, setStaffList] = React.useState<Staff[]>([
        { id: 1, name: 'Budi Santoso', role: 'Admin', status: 'Aktif', email: 'budi@toko.com' },
        { id: 2, name: 'Siti Aminah', role: 'Kasir', status: 'Aktif', email: 'siti@toko.com' },
        { id: 3, name: 'Agus Setiawan', role: 'Pelayan', status: 'Non-aktif', email: 'agus@toko.com' },
    ]);

    const [showModal, setShowModal] = React.useState(false);
    const [editStaff, setEditStaff] = React.useState<Staff | null>(null);
    const [formData, setFormData] = React.useState({
        name: '',
        role: 'Kasir',
        status: 'Aktif' as 'Aktif' | 'Non-aktif',
        email: ''
    });

    const handleOpenModal = (staff?: Staff) => {
        if (staff) {
            setEditStaff(staff);
            setFormData({
                name: staff.name,
                role: staff.role,
                status: staff.status,
                email: staff.email
            });
        } else {
            setEditStaff(null);
            setFormData({
                name: '',
                role: 'Kasir',
                status: 'Aktif',
                email: ''
            });
        }
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.email) {
            showToast('Nama dan Email wajib diisi', 'warning');
            return;
        }

        if (editStaff) {
            setStaffList(prev => prev.map(s => s.id === editStaff.id ? { ...s, ...formData } : s));
            showToast('Data staf diperbarui', 'success');
        } else {
            const newStaff: Staff = {
                id: Date.now(),
                ...formData
            };
            setStaffList(prev => [...prev, newStaff]);
            showToast('Staf baru ditambahkan', 'success');
        }
        setShowModal(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Hapus staf ini?')) {
            setStaffList(prev => prev.filter(s => s.id !== id));
            showToast('Staf telah dihapus', 'info');
        }
    };

    return (
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/settings')}
                        style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Manajemen Staf</h2>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                    <Plus size={20} />
                    Tambah Staf
                </button>
            </div>

            {/* Desktop Table View */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '24px', boxShadow: 'var(--shadow)', overflow: 'hidden' }} className="table-container desktop-only">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '20px', fontWeight: '600', color: '#64748b' }}>Nama</th>
                            <th style={{ padding: '20px', fontWeight: '600', color: '#64748b' }}>Peran</th>
                            <th style={{ padding: '20px', fontWeight: '600', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '20px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.map((staff) => (
                            <tr key={staff.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{staff.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{staff.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.875rem' }}>{staff.role}</span>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        background: staff.status === 'Aktif' ? '#dcfce7' : '#fee2e2',
                                        color: staff.status === 'Aktif' ? '#166534' : '#991b1b',
                                        borderRadius: '20px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}>
                                        {staff.status}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => handleOpenModal(staff)}
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer' }}
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(staff.id)}
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
                {staffList.map((staff) => (
                    <div key={staff.id} style={{ background: 'white', padding: '16px', borderRadius: '20px', boxShadow: 'var(--shadow)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '44px', height: '44px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{staff.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{staff.email}</div>
                                </div>
                            </div>
                            <span style={{
                                padding: '4px 10px',
                                background: staff.status === 'Aktif' ? '#dcfce7' : '#fee2e2',
                                color: staff.status === 'Aktif' ? '#166534' : '#991b1b',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '700'
                            }}>
                                {staff.status}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                            <span style={{ padding: '4px 10px', background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>{staff.role}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleOpenModal(staff)}
                                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(staff.id)}
                                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', fontWeight: '600', fontSize: '0.85rem' }}
                                >
                                    Hapus
                                </button>
                            </div>
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

                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '32px' }}>{editStaff ? 'Edit Staf' : 'Tambah Staf Baru'}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Budi Santoso"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="budi@email.com"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Peran</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Kasir">Kasir</option>
                                    <option value="Pelayan">Pelayan</option>
                                    <option value="Dapur">Dapur</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Non-aktif">Non-aktif</option>
                                </select>
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

export default StaffManagement;
