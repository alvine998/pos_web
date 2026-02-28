import React, { useState, useMemo } from 'react';
import { usePOS } from '../context/POSContext';
import { useToast } from '../context/ToastContext';
import { Plus, ArrowDownToLine, ArrowUpFromLine, Search, Filter, Wallet } from 'lucide-react';

const Finance: React.FC = () => {
    const { cashFlow, setCashFlow } = usePOS();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('Semua');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state
    const [newTransaction, setNewTransaction] = useState({
        type: 'Masuk' as 'Masuk' | 'Keluar',
        category: '',
        amount: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });

    const summary = useMemo(() => {
        return cashFlow.reduce(
            (acc, curr) => {
                if (curr.type === 'Masuk') {
                    acc.income += curr.amount;
                    acc.balance += curr.amount;
                } else {
                    acc.expense += curr.amount;
                    acc.balance -= curr.amount;
                }
                return acc;
            },
            { income: 0, expense: 0, balance: 0 }
        );
    }, [cashFlow]);

    const filteredCashFlow = useMemo(() => {
        return cashFlow.filter(item => {
            const matchesSearch = item.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'Semua' || item.type === filterType;
            return matchesSearch && matchesType;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [cashFlow, searchTerm, filterType]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatInputValue = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (!numericValue) return '';
        return new Intl.NumberFormat('id-ID').format(parseInt(numericValue, 10));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatInputValue(e.target.value);
        setNewTransaction({ ...newTransaction, amount: formatted });
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();

        const amountNum = parseFloat(newTransaction.amount.replace(/\./g, ''));
        if (isNaN(amountNum) || amountNum <= 0) return;

        const newRecord = {
            id: `cf_${Date.now()}`,
            date: newTransaction.date,
            type: newTransaction.type,
            category: newTransaction.category || 'Lainnya',
            amount: amountNum,
            note: newTransaction.note
        };

        setCashFlow([...cashFlow, newRecord]);
        setIsAddModalOpen(false);
        setNewTransaction({
            type: 'Masuk',
            category: '',
            amount: '',
            note: '',
            date: new Date().toISOString().split('T')[0]
        });
        showToast('Transaksi berhasil ditambahkan', 'success');
    };

    return (
        <div className="finance-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Keuangan / Akuntansi</h2>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>Kelola arus kas masuk dan keluar</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={{
                        padding: '10px 16px',
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    <Plus size={20} />
                    Catat Transaksi
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#eef2ff', borderRadius: '8px', color: '#4f46e5' }}>
                            <Wallet size={24} />
                        </div>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>Total Saldo</h3>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{formatCurrency(summary.balance)}</p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#ecfdf5', borderRadius: '8px', color: '#10b981' }}>
                            <ArrowDownToLine size={24} />
                        </div>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>Total Pemasukan</h3>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{formatCurrency(summary.income)}</p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#fef2f2', borderRadius: '8px', color: '#ef4444' }}>
                            <ArrowUpFromLine size={24} />
                        </div>
                        <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>Total Pengeluaran</h3>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{formatCurrency(summary.expense)}</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 40px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '0 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                    <Filter size={20} color="#6b7280" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ border: 'none', padding: '10px 0', outline: 'none', backgroundColor: 'transparent' }}
                    >
                        <option value="Semua">Semua Tipe</option>
                        <option value="Masuk">Pemasukan</option>
                        <option value="Keluar">Pengeluaran</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '16px', fontWeight: 500, color: '#6b7280', fontSize: '14px' }}>Tanggal</th>
                                <th style={{ padding: '16px', fontWeight: 500, color: '#6b7280', fontSize: '14px' }}>Tipe</th>
                                <th style={{ padding: '16px', fontWeight: 500, color: '#6b7280', fontSize: '14px' }}>Kategori</th>
                                <th style={{ padding: '16px', fontWeight: 500, color: '#6b7280', fontSize: '14px' }}>Keterangan</th>
                                <th style={{ padding: '16px', fontWeight: 500, color: '#6b7280', fontSize: '14px', textAlign: 'right' }}>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCashFlow.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                        Tidak ada data transaksi
                                    </td>
                                </tr>
                            ) : (
                                filteredCashFlow.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>
                                            {new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                backgroundColor: item.type === 'Masuk' ? '#ecfdf5' : '#fef2f2',
                                                color: item.type === 'Masuk' ? '#10b981' : '#ef4444'
                                            }}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{item.category}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{item.note}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, textAlign: 'right', color: item.type === 'Masuk' ? '#10b981' : '#ef4444' }}>
                                            {item.type === 'Masuk' ? '+' : '-'}{formatCurrency(item.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {isAddModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Tambah Transaksi</h3>

                        <form onSubmit={handleAddTransaction}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Tipe Transaksi</label>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Masuk"
                                            checked={newTransaction.type === 'Masuk'}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'Masuk' | 'Keluar' })}
                                        />
                                        Pemasukan
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Keluar"
                                            checked={newTransaction.type === 'Keluar'}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'Masuk' | 'Keluar' })}
                                        />
                                        Pengeluaran
                                    </label>
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Tanggal</label>
                                <input
                                    type="date"
                                    required
                                    value={newTransaction.date}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Kategori</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Operasional, Modal, Gaji"
                                    value={newTransaction.category}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Jumlah (Rp)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    value={newTransaction.amount}
                                    onChange={handleAmountChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Keterangan</label>
                                <textarea
                                    required
                                    placeholder="Detail transaksi"
                                    value={newTransaction.note}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '80px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                                >
                                    Simpan Transaksi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;
