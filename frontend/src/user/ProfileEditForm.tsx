import { useState } from 'react';
import './User.css';

export function ProfileEditForm({ user, onSave, onCancel, triggerToast }) {
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
        throw new Error(data.error || 'Failed to update profile');
      }

      if (triggerToast) {
        triggerToast(data.message || 'Profile updated successfully!', '♡');
      }

      onSave(data.user);
    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || 'Something went wrong', '⚠️');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form">
      <div className="profile-edit-avatar-row">
        <label className="profile-edit-avatar-label">
          {avatarFile ? `New photo: ${avatarFile.name}` : 'Change Photo 📷'}
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
        Username
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={loading}
        />
      </label>

      <label>
        First Name
        <input
          type="text"
          value={formData.firstname}
          onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
          disabled={loading}
        />
      </label>

      <label>
        Last Name
        <input
          type="text"
          value={formData.lastname}
          onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
          disabled={loading}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
        />
      </label>

      <label>
        Bio
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          disabled={loading}
        />
      </label>

      <hr className="form-divider" />
      <p className="password-section-title">Chaaaaaaange Paaaaaaaasswoooooooooooord</p>

      <label>
        Current Password
        <input
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          placeholder="Enter current password"
          disabled={loading}
        />
      </label>

      <label>
        New Password
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          placeholder="Enter new password"
          disabled={loading}
        />
      </label>

      <div className="profile-edit-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
}