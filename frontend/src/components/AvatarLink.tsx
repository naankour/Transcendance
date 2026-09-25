import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../utils/avatar.js';
import './AvatarLink.css';

interface AvatarLinkProps {
	userId: number;
	avatarUrl: string | null;
	username: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

function AvatarLink({ userId, avatarUrl, username, size = 'md', className = '' }: AvatarLinkProps) {
	return (
		<Link to={`/profile/${userId}`} className={`avatar-link ${className}`}>
			<img
				src={getAvatarUrl(avatarUrl)}
				alt={username}
				className={`avatar-link-img avatar-link-img--${size}`}
			/>
		</Link>
	);
}

export default AvatarLink;