import React from 'react';
import { ShoppingCart, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        username: 'admin',
        password: 'password',
        role: 'admin'
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await login(formData.username, formData.password, formData.role);
            if (success) {
                showToast('Login Berhasil', 'success');
                navigate('/dashboard');
            }
        } catch (error) {
            showToast('Username atau Password salah', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <ShoppingCart size={48} color="var(--primary)" />
                    <h2>Selamat Datang</h2>
                    <p style={{ color: '#64748b' }}>Silakan masuk untuk melanjutkan</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="role">Peran</label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="admin">Admin</option>
                            <option value="cashier">Kasir</option>
                            <option value="waiter">Pelayan</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Nama Pengguna</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Masukkan nama pengguna"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Kata Sandi</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Masukkan kata sandi"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {isLoading ? 'Masuk...' : <><LogIn size={18} /> Masuk</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
