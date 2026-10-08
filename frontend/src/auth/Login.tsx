import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { identifySocket } from '../../socket';
import { refreshUnreadCount } from '../notification';

export function Login({ onSwitchToRegister, triggerToast }) {
  const { t } = useTranslation();
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
        const errorMessage = data.error || data.message || t('auth.loginFailed');
        throw new Error(errorMessage);
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        identifySocket();
        refreshUnreadCount();
      }

      triggerToast(t('auth.loginSuccess'));

      setTimeout(() => {
        navigate('/');
      }, 1200);

    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || t('auth.somethingWrong'), '⚠️');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{t('auth.welcomeBack')}</h2>

      <input
        type="email"
        placeholder={t('auth.email')}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        disabled={loading}
      />

      <input
        type="password"
        placeholder={t('auth.password')}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? t('auth.signingIn') : t('auth.signIn')}
      </button>

      <p>
        {t('auth.noAccount')}{' '}
        <button type="button" onClick={onSwitchToRegister} className="link-btn" disabled={loading}>
          {t('auth.register')}
        </button>
      </p>
    </form>
  );
}