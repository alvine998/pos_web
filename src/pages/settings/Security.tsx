import React from 'react';
import { ChevronLeft, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Security: React.FC = () => {
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
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Keamanan</h2>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ background: 'white', padding: 'var(--content-padding, 32px)', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '12px', color: '#ef4444' }}>
                            <Key size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Ubah Kata Sandi</h3>
                    </div>

                    <div className="auth-form" style={{ maxWidth: 'none' }}>
                        <div className="form-group">
                            <label>Kata Sandi Saat Ini</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <div className="responsive-modal-grid">
                            <div className="form-group">
                                <label>Kata Sandi Baru</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                            <div className="form-group">
                                <label>Konfirmasi Kata Sandi Baru</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                        </div>
                        <button style={{ width: '100%', marginTop: '12px', padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                            Update Kata Sandi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
