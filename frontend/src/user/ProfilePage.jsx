
import { useState, useEffect } from 'react';
import { ProfileHeader } from './ProfileHeader';     
import { ProfileEditForm } from './ProfileEditForm'; 

export function ProfilePage({ triggerToast }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load profile');
      }

      setUser(data);
    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || 'Something went wrong', '⚠️');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
    if (triggerToast) {
      triggerToast('Profile updated ♡⸜(˶˃ ᵕ ˂˶)⸝♡', '✨');
    }
  };

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (!user) {
    return <div className="profile-container">Could not load profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-box">

        <div className="profile-header-section">
          <ProfileHeader user={user} isOwnProfile={true} onEditClick={() => setIsEditing(true)} />
        </div>

        <div className="profile-info-section">
          {isEditing ? (
            <ProfileEditForm
              user={user}
              onSave={handleProfileUpdated}
              onCancel={() => setIsEditing(false)}
              triggerToast={triggerToast}
            />
          ) : (
            <div className="profile-info">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Bio:</strong> {user.bio || 'No bio yet.'}</p>
            </div>
          )}
        </div>

        <div className="profile-follow-section">
          {/* <Followers userId={user.id} /> */}
          {/* <Following userId={user.id} /> */}
        </div>

        <div className="profile-watchlist-section">
          {/* <Watchlist userId={user.id} /> */}
        </div>

        <div className="profile-favorites-section">
          {/* <Favorites userId={user.id} /> */}
        </div>

      </div>
    </div>
  );
}