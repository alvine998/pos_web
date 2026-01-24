import React from 'react';
import { ChevronLeft, Bell, ShoppingCart, Package, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
    const navigate = useNavigate();

    const ToggleItem: React.FC<{ icon: any, title: string, desc: string, enabled: boolean }> = ({ icon: Icon, title, desc, enabled }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px', color: 'var(--primary)', height: 'fit-content' }}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>{title}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{desc}</p>
                </div>
            </div>
            <div style={{
                width: '44px',
                height: '24px',
                background: enabled ? 'var(--primary)' : '#cbd5e1',
                borderRadius: '12px',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: enabled ? 'flex-end' : 'flex-start',
                flexShrink: 0
            }}>
                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <button
                    onClick={() => navigate('/settings')}
                    style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Notifikasi</h2>
            </div>

            <div style={{ background: 'white', padding: 'var(--content-padding, 32px)', borderRadius: '24px', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ToggleItem
                    icon={ShoppingCart}
                    title="Pesanan Baru"
                    desc="Terima notifikasi setiap ada pesanan baru yang masuk"
                    enabled={true}
                />
                <ToggleItem
                    icon={Package}
                    title="Stok Menipis"
                    desc="Peringatan otomatis saat stok produk di bawah batas minimum"
                    enabled={true}
                />
                <ToggleItem
                    icon={Bell}
                    title="Laporan Harian"
                    desc="Kirim ringkasan penjualan harian ke email pemilik"
                    enabled={false}
                />
                <ToggleItem
                    icon={Info}
                    title="Pembaruan Sistem"
                    desc="Informasi mengenai fitur baru dan pemeliharaan sistem"
                    enabled={true}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button style={{ width: '100%', padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Simpan Preferensi</button>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
