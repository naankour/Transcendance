import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { ProfileHeader } from './ProfileHeader'; 
import { ProfileEditForm } from './ProfileEditForm'; 
// import { Followers } from '../user/Followers.tsx'
import Follows from '../Follows/Follows';

export function ProfilePage({ triggerToast }) 
{
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const { id: userIdFromParams } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode<{ id: number }>(token);
      currentUserId = decoded.id;
    } catch (e) {
      console.error('Token invalide :', e);
    }
  }

  const isOwnProfile = !userIdFromParams || Number(userIdFromParams) === Number(currentUserId);

  useEffect(() => {
    fetchProfile();
  }, [userIdFromParams]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = isOwnProfile ? '/api/users/me' : `/api/users/${userIdFromParams}`;

      const response = await fetch(endpoint, {
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
      if (triggerToast) 
        triggerToast(err.message || 'Something went wrong', '⚠️');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId: user.id }),
      });

      const conversation = await response.json();

      if (!response.ok) {
        throw new Error(conversation.error || 'Failed to start conversation');
      }

      // redirige vers le chat
      // navigate(`/chat?id=${conversation.id}`);
      navigate(`/conversations?id=${conversation.id}`);
    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || 'Something went wrong', '⚠️');
      }
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
    if (triggerToast) {
      triggerToast('Profile updated ♡⸜(˶˃ ᵕ ˂˶)⸝♡', '✨');
    }
  };

  if (loading) 
    return <div className="profile-container">Loading profile...</div>;

  if (!user) 
    return <div className="profile-container">Could not load profile.</div>;

  return (
    <div className="profile-container">
      <div className="profile-box">

        <div className="profile-header-section">
          <ProfileHeader 
            user={user} 
            isOwnProfile={isOwnProfile} 
            onEditClick={() => setIsEditing(true)} 
            onStartChat={handleStartChat}
          />
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
            <Follows
              userId={user.id}
              isOwnProfile={isOwnProfile}
              triggerToast={triggerToast}
              />
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