import { getAvatarUrl } from '../utils/avatar';

export function UserCard({ user }) {
  return (
    <div className="user-card">
      <img
        src={getAvatarUrl(user?.avatar_url)}
        alt={`${user.username}'s avatar`}
        className="user-card-avatar"
      />
      <span className="user-card-username">{user.username}</span>
    </div>
  );
}