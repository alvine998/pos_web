import React, { useState } from 'react';
import { ChevronLeft, Wallet, Banknote, Percent, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePOS } from '../../context/POSContext';
import { useToast } from '../../context/ToastContext';

const Payments: React.FC = () => {
    const navigate = useNavigate();
    const { paymentSettings, setPaymentSettings } = usePOS();
    const { showToast } = useToast();

    const [isCashEnabled, setIsCashEnabled] = useState(paymentSettings.isCashEnabled);
    const [isQrisEnabled, setIsQrisEnabled] = useState(paymentSettings.isQrisEnabled);
    const [isBankEnabled, setIsBankEnabled] = useState(paymentSettings.isBankEnabled);
    const [bankAccounts, setBankAccounts] = useState(paymentSettings.bankAccounts);

    const addBankAccount = () => {
        setBankAccounts([...bankAccounts, { id: Date.now(), bankName: '', accountNo: '', holderName: '' }]);
    };

    const removeBankAccount = (id: number) => {
        setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
    };

    const updateBankAccount = (id: number, field: string, value: string) => {
        setBankAccounts(bankAccounts.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
    };

    const formatIDR = (value: string | number) => {
        if (!value) return '';
        const num = typeof value === 'string' ? value.replace(/\D/g, '') : value.toString();
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseIDR = (value: string) => {
        return value.replace(/\D/g, '');
    };

    const [serviceCharge, setServiceCharge] = useState('0');

    const handleServiceChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = parseIDR(e.target.value);
        setServiceCharge(rawValue);
    };

    const PaymentMethod: React.FC<{ icon: any, title: string, enabled: boolean, onToggle?: () => void }> = ({ icon: Icon, title, enabled, onToggle }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Icon size={20} />
                </div>
                <span style={{ fontWeight: '500' }}>{title}</span>
            </div>
            <div
                onClick={onToggle}
                style={{
                    width: '44px',
                    height: '24px',
                    background: enabled ? 'var(--primary)' : '#cbd5e1',
                    borderRadius: '12px',
                    padding: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: enabled ? 'flex-end' : 'flex-start',
                    transition: 'all 0.2s'
                }}>
                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={() => navigate('/settings')}
                    style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Pembayaran</h2>
            </div>

            <div style={{ background: 'white', padding: 'var(--content-padding, 32px)', borderRadius: '24px', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <section>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px' }}>Metode Pembayaran</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <PaymentMethod
                            icon={Banknote}
                            title="Tunai"
                            enabled={isCashEnabled}
                            onToggle={() => setIsCashEnabled(!isCashEnabled)}
                        />
                        <PaymentMethod
                            icon={Wallet}
                            title="QRIS / E-Wallet"
                            enabled={isQrisEnabled}
                            onToggle={() => setIsQrisEnabled(!isQrisEnabled)}
                        />
                        {isQrisEnabled && (
                            <div style={{ padding: '24px', border: '2px dashed #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: '#f8fafc', marginLeft: 'var(--sub-margin, 24px)' }}>
                                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                                    <Camera size={24} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>Unggah Gambar QRIS</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Seret atau klik untuk memilih file</p>
                                </div>
                                <button style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>Pilih File</button>
                            </div>
                        )}
                        <PaymentMethod
                            icon={Percent}
                            title="Transfer Bank"
                            enabled={isBankEnabled}
                            onToggle={() => setIsBankEnabled(!isBankEnabled)}
                        />
                        {isBankEnabled && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc', padding: 'var(--content-padding, 24px)', borderRadius: '16px', border: '1px solid #e2e8f0', marginLeft: 'var(--sub-margin, 24px)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    <h4 style={{ fontWeight: '600', fontSize: '0.9rem' }}>Daftar Rekening Bank</h4>
                                    <button
                                        onClick={addBankAccount}
                                        style={{ color: 'var(--primary)', background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        + Tambah Rekening
                                    </button>
                                </div>
                                {bankAccounts.map((acc) => (
                                    <div key={acc.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                                        {bankAccounts.length > 1 && (
                                            <button
                                                onClick={() => removeBankAccount(acc.id)}
                                                style={{ position: 'absolute', top: '12px', right: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
                                            >
                                                ×
                                            </button>
                                        )}
                                        <div className="responsive-modal-grid">
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Nama Bank</label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: BCA, Mandiri"
                                                    value={acc.bankName}
                                                    onChange={(e) => updateBankAccount(acc.id, 'bankName', e.target.value)}
                                                    style={{ padding: '8px 12px' }}
                                                />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Nomor Rekening</label>
                                                <input
                                                    type="text"
                                                    placeholder="000000000"
                                                    value={acc.accountNo}
                                                    onChange={(e) => updateBankAccount(acc.id, 'accountNo', e.target.value)}
                                                    style={{ padding: '8px 12px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Nama Pemilik Rekening</label>
                                            <input
                                                type="text"
                                                placeholder="Nama sesuai buku tabungan"
                                                value={acc.holderName}
                                                onChange={(e) => updateBankAccount(acc.id, 'holderName', e.target.value)}
                                                style={{ padding: '8px 12px' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px' }}>Pajak & Biaya</h3>
                    <div className="auth-form" style={{ maxWidth: 'none' }}>
                        <div className="form-group">
                            <label>Pajak Pertambahan Nilai (PPN %)</label>
                            <input type="number" defaultValue="11" />
                        </div>
                        <div className="form-group">
                            <label>Biaya Layanan (Service Charge Amt)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: '500' }}>Rp</span>
                                <input
                                    type="text"
                                    value={formatIDR(serviceCharge)}
                                    onChange={handleServiceChargeChange}
                                    style={{ paddingLeft: '44px' }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/settings')}
                        style={{ flex: '1 1 120px', padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            setPaymentSettings({
                                isCashEnabled,
                                isQrisEnabled,
                                isBankEnabled,
                                bankAccounts
                            });
                            showToast('Pengaturan pembayaran berhasil disimpan', 'success');
                        }}
                        style={{ flex: '1 1 200px', padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payments;
