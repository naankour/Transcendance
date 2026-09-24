import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from 'react-i18next';
import { ProfileHeader } from './ProfileHeader'; 
import { ProfileEditForm } from './ProfileEditForm'; 
import Followers  from '../Followers/Followers';
import Follows from '../Follows/Follows';
import Watchlist from '../Watchlist/Watchlist';
import Favorites from '../Favorites/Favorites';
import AuthRequired from "../components/AuthRequired";
import './ProfilePage.css';



export function ProfilePage({ triggerToast }) 
{
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const[isFollowing, setIsFollowing] = useState(false);

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

  useEffect(() => {
    if (isOwnProfile || !user)
      return;
    
    const token = localStorage.getItem('token');

    fetch('/api/follows', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    })
    .then(res => res.json())
    .then(data => {
      const alreadyFollowing = data.some((f: any) => f.followed_id === user.id);
      setIsFollowing(alreadyFollowing);
    })
    .catch(err => console.error(err));
  }, [user, isOwnProfile]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token)
      {
        setUser(null);
        return;
      }
      const endpoint = isOwnProfile ? '/api/users/me' : `/api/users/${userIdFromParams}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ? t(data.error) : t('profile.failedToLoad'));
      }

      setUser(data);
    } catch (err) {
      if (triggerToast) 
        triggerToast(err.message || t('profile.somethingWentWrong'), '⚠️');
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
        throw new Error(conversation.error ? t(conversation.error) : t('profile.failedToStartConversation'));
      }

      // redirige vers le chat
      // navigate(`/chat?id=${conversation.id}`);
      navigate(`/conversations?id=${conversation.id}`);
    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || t('profile.somethingWentWrong'), '⚠️');
      }
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
    if (triggerToast) {
      triggerToast(t('profile.profileUpdated') + ' ♡⸜(˶˃ ᵕ ˂˶)⸝♡', '✨');
    }
  };

  if (loading) 
    return <div className="profile-container">{t('profile.loading')}</div>;

  if (!user) 
    return <AuthRequired />

  return (
    <div className="profile-container">
      <div className="profile-box">

        <div className="profile-header-section">
          <ProfileHeader
            user={user}
            isOwnProfile={isOwnProfile}
            onEditClick={() => setIsEditing(prev => !prev)}
            onStartChat={handleStartChat}
            triggerToast={triggerToast}
            isFollowing={isFollowing}
            onFollowChange={() => setIsFollowing(prev => !prev)}
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
              <p><strong></strong> {user.bio || t('profile.noBio')}</p>
            </div>
          )}
        </div>

        <div className="profile-follow-section">
            <Follows
              userId={user.id}
              isOwnProfile={isOwnProfile}
              triggerToast={triggerToast}
              />
              <Followers
              userId={user.id}
              isOwnProfile={isOwnProfile}
              triggerToast={triggerToast}
              />
          {/* <Followers userId={user.id} /> */}
          {/* <Following userId={user.id} /> */}
        </div>

        <div className="profile-watchlist-section">
          <Watchlist 
          userId={user.id}
          triggerToast={triggerToast} 
          />
        </div>

        <div className="profile-favorites-section">
          <Favorites 
          userId={user.id} 
          triggerToast={triggerToast}
          />
        </div>

      </div>
    </div>
  );
}
