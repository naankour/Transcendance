
export function UserCard({ user }) {
  return (
    <div className="user-card">
      <img
        src={user.avatar_url || '/avatars/default_avatar.jpg'}
        alt={`${user.username}'s avatar`}
        className="user-card-avatar"
      />
      <span className="user-card-username">{user.username}</span>
    </div>
  );
}