import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({ onSwitchToRegister, triggerToast }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Login failed';
        throw new Error(errorMessage);
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      triggerToast("You're in ◝(ᵔᗜᵔ)◜ heehee...");

      setTimeout(() => {
        navigate('/');
      }, 1200);

    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || 'Something went wrong', '⚠️');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Welcome Back</h2>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <p>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="link-btn" disabled={loading}>
          Register
        </button>
      </p>
    </form>
  );
}