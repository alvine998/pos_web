import React, { useState } from 'react';
import { Plus, Minus, Search, ShoppingCart, Trash2, X, Users, Utensils, ShoppingBag, CheckCircle2, Printer, RotateCcw, QrCode } from 'lucide-react';

// Interface for local cart item state
interface CartItem {
    product: Product;
    quantity: number;
}

import { usePOS } from '../context/POSContext';
import { useToast } from '../context/ToastContext';
import type { Product, StockMovement } from '../data/dummyData';

const Transaction: React.FC = () => {
    const { products, setProducts, setMovements, setTransactions, categories, paymentSettings } = usePOS();
    const { showToast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderType, setOrderType] = useState<'Dine In' | 'Take Away'>('Dine In');
    const [tableNumber, setTableNumber] = useState('');
    const [totalPersons, setTotalPersons] = useState('');
    const [discount, setDiscount] = useState<number>(0);
    const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer Bank' | null>(null);

    const filteredProducts = products.filter(p =>
        (selectedCategory === 'Semua' || p.category === selectedCategory) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            showToast('Stok habis untuk produk ini', 'error');
            return;
        }
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    showToast('Stok tidak mencukupi', 'warning');
                    return prev;
                }
                return prev.map(item =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === id) {
                const newQty = item.quantity + delta;

                // If adding, check stock
                if (delta > 0 && newQty > item.product.stock) {
                    showToast('Stok tidak mencukupi', 'warning');
                    return item;
                }

                return { ...item, quantity: Math.max(0, newQty) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = (subtotal - discount) * 0.1;
    const total = Math.max(0, subtotal - discount + tax);

    const handleConfirmOrder = () => {
        if (orderType === 'Dine In' && (!tableNumber || !totalPersons)) {
            showToast('Mohon isi nomor meja dan jumlah orang', 'warning');
            return;
        }

        if (!selectedPaymentMethod) {
            showToast('Silahkan pilih metode pembayaran', 'warning');
            return;
        }

        const details = {
            items: [...cart],
            orderType,
            tableNumber,
            totalPersons,
            subtotal,
            discount,
            tax,
            total,
            date: new Date().toLocaleString('id-ID'),
            orderId: `TRX-${Date.now().toString().slice(-6)}`,
            paymentMethod: selectedPaymentMethod
        };

        // INTEGRATION: Deduct Stock
        setProducts(prevProducts => prevProducts.map(p => {
            const cartItem = cart.find(item => item.product.id === p.id);
            if (cartItem) {
                return { ...p, stock: p.stock - cartItem.quantity };
            }
            return p;
        }));

        // INTEGRATION: Record Movements
        const newMovements: StockMovement[] = cart.map(item => ({
            id: `M-${Date.now()}-${item.product.id}`,
            productId: item.product.id,
            date: new Date().toISOString().split('T')[0],
            type: 'Keluar',
            quantity: item.quantity,
            note: `Penjualan ${details.orderId}`
        }));
        setMovements(prev => [...newMovements, ...prev]);

        // INTEGRATION: Record Transaction
        const newTransaction = {
            id: details.orderId,
            date: details.date,
            cashier: 'Admin', // Default for now
            items: cart.map(item => ({
                productId: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                cost: item.product.cost
            })),
            subtotal: details.subtotal,
            tax: details.tax,
            total: details.total,
            profit: cart.reduce((p, item) => p + ((item.product.price - item.product.cost) * item.quantity), 0) - (discount * 0.9), // rough calculation minus discount
            type: details.orderType,
            paymentMethod: details.paymentMethod
        };
        setTransactions(prev => [newTransaction, ...prev]);

        setLastOrderDetails(details);
        setShowCheckoutModal(false);
        setShowSuccessModal(true);
    };

    const resetTransaction = () => {
        setShowSuccessModal(false);
        setCart([]);
        setTableNumber('');
        setTotalPersons('');
        setOrderType('Dine In');
        setDiscount(0);
        setLastOrderDetails(null);
        setSelectedPaymentMethod(null);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="transaction-grid">
            <button className="cart-toggle-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
                <div style={{ position: 'relative' }}>
                    <ShoppingCart size={24} />
                    {cart.length > 0 && (
                        <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {cart.reduce((s, i) => s + i.quantity, 0)}
                        </span>
                    )}
                </div>
            </button>

            {/* Product Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                    <div className="filter-bar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%', WebkitOverflowScrolling: 'touch', background: 'transparent', padding: 0, boxShadow: 'none' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: selectedCategory === cat ? 'var(--primary)' : '#f1f5f9',
                                    color: selectedCategory === cat ? 'white' : '#64748b',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="product-card"
                            style={{
                                background: 'white',
                                padding: '16px',
                                borderRadius: '16px',
                                boxShadow: 'var(--shadow)',
                                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                transition: 'transform 0.2s',
                                textAlign: 'center',
                                opacity: product.stock > 0 ? 1 : 0.5,
                                position: 'relative'
                            }}
                        >
                            {product.stock <= product.minStock && product.stock > 0 && (
                                <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff7ed', color: '#c2410c', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', border: '1px solid #fed7aa' }}>Low Stock</span>
                            )}
                            {product.stock <= 0 && (
                                <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', border: '1px solid #fecaca' }}>Habis</span>
                            )}
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{product.image}</div>
                            <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>{product.name}</h4>
                            <p style={{ color: 'var(--primary)', fontWeight: '700' }}>Rp {product.price.toLocaleString('id-ID')}</p>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Stok: {product.stock}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Section */}
            <div
                className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}
                style={{ borderRadius: '24px', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
                <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="mobile-only" onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b' }}>
                            <X size={24} />
                        </button>
                        <h3 style={{ fontSize: '1.25rem' }}>Pesanan Saat Ini</h3>
                    </div>
                    <button onClick={() => setCart([])} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                        <Trash2 size={20} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>
                            <ShoppingCart size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                            <p>Keranjang Anda kosong</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    {item.product.image}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ fontWeight: '600' }}>{item.product.name}</h5>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Rp {item.product.price.toLocaleString('id-ID')} per item</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button onClick={() => updateQuantity(item.product.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}><Minus size={14} /></button>
                                    <span style={{ fontWeight: '600', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.product.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer' }}><Plus size={14} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ padding: '24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '8px' }}>Diskon / Promo (Rp)</label>
                        <input
                            type="number"
                            value={discount || ''}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                            placeholder="Contoh: 5000"
                            style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                            <span>Subtotal</span>
                            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        {discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                                <span>Diskon</span>
                                <span>- Rp {discount.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                            <span>Pajak (10%)</span>
                            <span>Rp {tax.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.25rem', color: '#1e293b' }}>
                            <span>Total</span>
                            <span>Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <button
                        disabled={cart.length === 0}
                        onClick={() => setShowCheckoutModal(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: cart.length === 0 ? '#cbd5e1' : 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        Buat Pesanan
                    </button>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '16px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '480px', borderRadius: '32px', padding: '32px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => setShowCheckoutModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>Konfirmasi Pesanan</h3>

                        <div className="responsive-modal-grid" style={{ marginBottom: '24px', gap: '12px' }}>
                            <button
                                onClick={() => setOrderType('Dine In')}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '16px', border: orderType === 'Dine In' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                    background: orderType === 'Dine In' ? '#eff6ff' : 'white', color: orderType === 'Dine In' ? 'var(--primary)' : '#64748b', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                <Utensils size={18} /> Dine In
                            </button>
                            <button
                                onClick={() => setOrderType('Take Away')}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '16px', border: orderType === 'Take Away' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                    background: orderType === 'Take Away' ? '#eff6ff' : 'white', color: orderType === 'Take Away' ? 'var(--primary)' : '#64748b', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                <ShoppingBag size={18} /> Take Away
                            </button>
                        </div>

                        {orderType === 'Dine In' && (
                            <div className="responsive-modal-grid" style={{ marginBottom: '24px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.875rem', marginBottom: '8px' }}>Nomor Meja</label>
                                    <input
                                        type="text"
                                        placeholder="T-01"
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.875rem', marginBottom: '8px' }}>Jumlah Orang</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={totalPersons}
                                            onChange={(e) => setTotalPersons(e.target.value)}
                                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                        />
                                        <Users size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '12px' }}>Pilih Metode Pembayaran</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                                {paymentSettings.isCashEnabled && (
                                    <button
                                        onClick={() => setSelectedPaymentMethod('Tunai')}
                                        style={{
                                            padding: '12px', borderRadius: '12px', border: selectedPaymentMethod === 'Tunai' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                            background: selectedPaymentMethod === 'Tunai' ? '#eff6ff' : 'white', color: selectedPaymentMethod === 'Tunai' ? 'var(--primary)' : '#64748b', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
                                        }}
                                    >
                                        Tunai
                                    </button>
                                )}
                                {paymentSettings.isQrisEnabled && (
                                    <button
                                        onClick={() => setSelectedPaymentMethod('QRIS')}
                                        style={{
                                            padding: '12px', borderRadius: '12px', border: selectedPaymentMethod === 'QRIS' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                            background: selectedPaymentMethod === 'QRIS' ? '#eff6ff' : 'white', color: selectedPaymentMethod === 'QRIS' ? 'var(--primary)' : '#64748b', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
                                        }}
                                    >
                                        QRIS
                                    </button>
                                )}
                                {paymentSettings.isBankEnabled && (
                                    <button
                                        onClick={() => setSelectedPaymentMethod('Transfer Bank')}
                                        style={{
                                            padding: '12px', borderRadius: '12px', border: selectedPaymentMethod === 'Transfer Bank' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                            background: selectedPaymentMethod === 'Transfer Bank' ? '#eff6ff' : 'white', color: selectedPaymentMethod === 'Transfer Bank' ? 'var(--primary)' : '#64748b', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
                                        }}
                                    >
                                        Bank
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Payment Details Section */}
                        {selectedPaymentMethod === 'QRIS' && (
                            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ background: 'white', padding: '16px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    <QrCode size={160} color="#1e293b" />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>Scan QRIS</p>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Silahkan tunjukkan kode QR ini ke pelanggan</p>
                                </div>
                            </div>
                        )}

                        {selectedPaymentMethod === 'Transfer Bank' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Rekening Tujuan:</p>
                                {paymentSettings.bankAccounts.map(acc => (
                                    <div key={acc.id} style={{ padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{acc.bankName}</p>
                                            <p style={{ fontSize: '1rem', fontWeight: '600', margin: '4px 0' }}>{acc.accountNo}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>a.n {acc.holderName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', color: '#64748b' }}>
                                <span>{cart.length} Item</span>
                                <span>Total Tagihan</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600' }}>Ringkasan Pesanan</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmOrder}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)' }}
                        >
                            Konfirmasi & Bayar
                        </button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {
                showSuccessModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(8px)', padding: '16px' }}>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%', maxWidth: '400px' }}>
                            <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                                <CheckCircle2 size={48} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>Pesanan Berhasil!</h3>
                                <p style={{ color: '#64748b' }}>Transaksi telah dicatat ke dalam sistem.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                                <button
                                    onClick={handlePrint}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    <Printer size={20} /> Cetak Struk
                                </button>
                                <button
                                    onClick={resetTransaction}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', borderRadius: '16px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    <RotateCcw size={20} /> Pesanan Baru
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Hidden Receipt for Printing */}
            {
                lastOrderDetails && (
                    <div id="receipt-print" style={{
                        display: 'none',
                        width: '80mm',
                        fontSize: '12px',
                        lineHeight: '1.2',
                        padding: '10px',
                        background: 'white',
                        fontFamily: 'monospace',
                        color: 'black'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>TOKO KASIR POS</h2>
                            <p style={{ margin: '5px 0' }}>Jl. Contoh Alamat No. 123</p>
                            <p style={{ margin: '5px 0' }}>Telp: 0812-3456-7890</p>
                        </div>

                        <div style={{ borderBottom: '1px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Order ID:</span>
                                <span>{lastOrderDetails.orderId}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Tanggal:</span>
                                <span>{lastOrderDetails.date}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Tipe:</span>
                                <span>{lastOrderDetails.orderType}</span>
                            </div>
                            {lastOrderDetails.orderType === 'Dine In' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Meja:</span>
                                        <span>{lastOrderDetails.tableNumber}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Jumlah Orang:</span>
                                        <span>{lastOrderDetails.totalPersons}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ borderBottom: '1px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
                            {lastOrderDetails.items.map((item: any, idx: number) => (
                                <div key={idx} style={{ marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.product.name}</span>
                                        <span>x{item.quantity}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                                        <span>Rp {item.product.price.toLocaleString('id-ID')}</span>
                                        <span>Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderBottom: '1px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal:</span>
                                <span>Rp {lastOrderDetails.subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            {lastOrderDetails.discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Diskon:</span>
                                    <span>- Rp {lastOrderDetails.discount.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Pajak (10%):</span>
                                <span>Rp {lastOrderDetails.tax.toLocaleString('id-ID')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginTop: '5px' }}>
                                <span>TOTAL:</span>
                                <span>Rp {lastOrderDetails.total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <p>Terima Kasih</p>
                            <p>Silahkan Datang Kembali</p>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Transaction;
