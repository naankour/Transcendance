import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './User.css';

export function ProfileEditForm({ user, onSave, onCancel, triggerToast }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: user.username || '',
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    bio: user.bio || '',
    currentPassword: '',
    newPassword: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const dataToSend = new FormData();
      dataToSend.append('username', formData.username);
      dataToSend.append('firstname', formData.firstname);
      dataToSend.append('lastname', formData.lastname);
      dataToSend.append('email', formData.email);
      dataToSend.append('bio', formData.bio);

      if (formData.newPassword) {
        dataToSend.append('currentPassword', formData.currentPassword);
        dataToSend.append('newPassword', formData.newPassword);
      }

      if (avatarFile) {
        dataToSend.append('avatar', avatarFile);
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('profileEdit.updateFailed'));
      }

      if (triggerToast) {
        triggerToast(data.message || t('profileEdit.updateSuccess'), '♡');
      }

      onSave(data.user);
    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || t('profileEdit.somethingWrong'), '⚠️');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form">
      <div className="profile-edit-avatar-row">
        <label className="profile-edit-avatar-label">
          {avatarFile ? t('profileEdit.newPhoto', { name: avatarFile.name }) : t('profileEdit.changePhoto')}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={loading}
          />
        </label>
      </div>

      <label>
        {t('profileEdit.username')}
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={loading}
        />
      </label>

      <label>
        {t('profileEdit.firstname')}
        <input
          type="text"
          value={formData.firstname}
          onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
          disabled={loading}
        />
      </label>

      <label>
        {t('profileEdit.lastname')}
        <input
          type="text"
          value={formData.lastname}
          onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
          disabled={loading}
        />
      </label>

      <label>
        {t('profileEdit.email')}
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
        />
      </label>

      <label>
        {t('profileEdit.bio')}
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          disabled={loading}
        />
      </label>

      <hr className="form-divider" />
      <p className="password-section-title">{t('profileEdit.changePassword')}</p>

      <label>
        {t('profileEdit.currentPassword')}
        <input
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          placeholder={t('profileEdit.currentPasswordPlaceholder')}
          disabled={loading}
        />
      </label>

      <label>
        {t('profileEdit.newPassword')}
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          placeholder={t('profileEdit.newPasswordPlaceholder')}
          disabled={loading}
        />
      </label>

      <div className="profile-edit-actions">
        <button type="submit" disabled={loading}>
          {loading ? t('profileEdit.saving') : t('profileEdit.save')}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          {t('profileEdit.cancel')}
        </button>
      </div>
    </form>
  );
}