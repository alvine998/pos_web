import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, Store, CreditCard, ChevronRight } from 'lucide-react';

const SettingItem: React.FC<{ icon: any, title: string, desc: string, onClick?: () => void }> = ({ icon: Icon, title, desc, onClick }) => (
    <div
        onClick={onClick}
        style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            cursor: 'pointer',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid transparent',
            transition: 'all 0.2s'
        }} className="setting-item">
        <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
            <Icon size={24} />
        </div>
        <div style={{ flex: 1 }}>
            <h4 style={{ fontWeight: '600', marginBottom: '2px' }}>{title}</h4>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{desc}</p>
        </div>
        <ChevronRight size={20} color="#cbd5e1" />
    </div>
);

const Settings: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#1e293b' }}>Pengaturan Umum</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <SettingItem icon={Store} title="Profil Toko" desc="Kelola nama toko, alamat, dan informasi kontak" onClick={() => navigate('/settings/profile')} />
                    <SettingItem icon={CreditCard} title="Pembayaran" desc="Konfigurasi metode pembayaran dan tarif pajak" onClick={() => navigate('/settings/payments')} />
                    <SettingItem icon={Bell} title="Notifikasi" desc="Kelola notifikasi sistem dan pesanan" onClick={() => navigate('/settings/notifications')} />
                </div>
            </section>

            <section>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#1e293b' }}>Akun & Keamanan</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <SettingItem icon={User} title="Manajemen Staf" desc="Atur peran dan izin untuk karyawan" onClick={() => navigate('/settings/staff')} />
                    <SettingItem icon={Shield} title="Keamanan" desc="Kebijakan kata sandi dan manajemen sesi" onClick={() => navigate('/settings/security')} />
                </div>
            </section>

            <style>{`
        .setting-item:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
        </div>
    );
};

export default Settings;
