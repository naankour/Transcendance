import { useState } from 'react';

export function ProfileEditForm({ user, onSave, onCancel, triggerToast }) {
  const BACKEND_URL = 'http://localhost:3000';

  const getAvatarUrl = (url) => {
    if (!url) return `${BACKEND_URL}/avatars/default_avatar.jpg`;
    if (url.startsWith('blob:') || url.startsWith('http')) {
      return url;
    }
    if (url.startsWith('/avatars')) {
      return `${BACKEND_URL}${url}`;
    }
    return url;
  };

  const [formData, setFormData] = useState({
    username: user.username || '',
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    bio: user.bio || '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatar_url || '/avatars/default_avatar.jpg');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <img
          src={getAvatarUrl(previewUrl)}
          alt="Avatar Preview"
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <label style={{ cursor: 'pointer', background: '#eee', padding: '8px 12px', borderRadius: '5px' }}>
          Change Photo 📷
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