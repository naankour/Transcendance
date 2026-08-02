export function ProfileHeader({ user, isOwnProfile, onEditClick, onStartChat }) {
  return (
    <div className="profile-header">
      <img
        src={user.avatar_url || '/avatars/default_avatar.jpg'}
        alt={`${user.username}'s avatar`}
        className="profile-avatar"
      />

      <div className="profile-header-info">
        <h2 className="profile-username">{user.username}</h2>
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
          Edit Profile
        </button>
      ) : (
        /* profil de quelq'un d'autre -> bouton message */
        <button
          type="button"
          onClick={onStartChat}
          className="message-btn"
        >
          Message 💬
        </button>
      )}
    </div>
  );
}