import { getAvatarUrl } from '../utils/avatar';

export function UserCard({ user, className = "" }) {
  return (
    <div className={`user-card ${className}`}>
      <img
        src={getAvatarUrl(user?.avatar_url)}
        alt={`${user?.username ?? 'User'}'s avatar`}
        className={`${className}-avatar`}
      />
      <span className={`${className}-username`}>
        {user?.username}
      </span>
    </div>
  );
}

export default UserCard;