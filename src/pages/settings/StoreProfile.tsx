import React from 'react';
import { ChevronLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreProfile: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={() => navigate('/settings')}
                    style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Profil Toko</h2>
            </div>

            <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '100px', height: '100px', background: '#f8fafc', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', position: 'relative' }}>
                        <Camera size={32} color="#94a3b8" />
                        <button style={{ position: 'absolute', bottom: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            +
                        </button>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Logo Toko</h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Gunakan file PNG atau JPG minimal 500x500px</p>
                    </div>
                </div>

                <div className="auth-form" style={{ maxWidth: 'none' }}>
                    <div className="form-group">
                        <label>Nama Toko</label>
                        <input type="text" defaultValue="Kedai Kopi Digital" />
                    </div>
                    <div className="form-group">
                        <label>Alamat Email</label>
                        <input type="email" defaultValue="kontak@kedaikopi.com" />
                    </div>
                    <div className="form-group">
                        <label>Nomor Telepon</label>
                        <input type="text" defaultValue="+62 812 3456 7890" />
                    </div>
                    <div className="form-group">
                        <label>Alamat Lengkap</label>
                        <textarea
                            style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '1rem', minHeight: '100px', fontFamily: 'inherit' }}
                            defaultValue="Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Batal</button>
                    <button style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Simpan Perubahan</button>
                </div>
            </div>
        </div>
    );
};

export default StoreProfile;
