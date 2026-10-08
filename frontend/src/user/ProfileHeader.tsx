import { useTranslation } from 'react-i18next';
import { getAvatarUrl } from '../utils/avatar';
import FollowsButton from '../components/FollowsButton';
import OnlineStatus from '../components/Onlinestatus';
import './ProfileHeader.css';

export function ProfileHeader({ user, isOwnProfile, onEditClick, onStartChat, triggerToast, isFollowing, onFollowChange }) {
  const { t } = useTranslation();

  return (
    <div className="profile-header">
      <img
        src={getAvatarUrl(user?.avatar_url)}
        alt={`${user.username}'s avatar`}
        className="profile-avatar"
      />
      <div className="profile-header-info">
        <h2 className="profile-username">{user.username}</h2>
        <OnlineStatus userId={user.id} />
        {(user.firstname || user.lastname) && (
          <p className="profile-fullname">
            {user.firstname} {user.lastname}
          </p>
        )}
      </div>

      {/* mon profil -> bouton edit */}
      {isOwnProfile ? (
        <button
          type="button"
          onClick={onEditClick}
          className="edit-profile-btn"
        >
          {t('profile.editProfile')}
        </button>
      ) : (
        /* profil de quelq'un d'autre -> bouton message */
        <div>
          <button
          type="button"
          onClick={onStartChat}
          className="message-btn"
          >
          {t('profile.message')} 💬
          </button>
          <FollowsButton
            userId={user.id}
            action={isFollowing ? 'unfollow' : 'follow'}
            triggerToast={triggerToast}
            onSuccess={onFollowChange}
          />

        </div>
      )}
    </div>
  );
}
