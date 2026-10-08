import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../utils/avatar.js';

interface AvatarLinkProps {
	userId: number;
	avatarUrl: string | null;
	username: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const sizeClasses = {
	sm: 'h-8 w-8',
	md: 'h-12 w-12',
	lg: 'h-16 w-16',
};

function AvatarLink({ userId, avatarUrl, username, size = 'md', className = '' }: AvatarLinkProps) {
	return (
		<Link
			to={`/profile/${userId}`}
			className={`inline-block shrink-0 leading-none ${className}`.trim()}
		>
			<img
				src={getAvatarUrl(avatarUrl)}
				alt={username}
				className={`object-cover rounded-[4px] border-[3px] border-[var(--color-bg)] outline outline-1 outline-[var(--color-accent-soft)] shadow-[0_0_0_1px_var(--color-bg),0_0_6px_var(--color-accent)] transition hover:scale-[1.06] hover:shadow-[0_0_0_1px_var(--color-bg),0_0_10px_var(--color-accent)] ${sizeClasses[size]} ${size === 'lg' ? 'border-4 outline-2 shadow-[0_0_0_2px_var(--color-bg),0_0_8px_var(--color-accent)] hover:shadow-[0_0_0_2px_var(--color-bg),0_0_14px_var(--color-accent)]' : ''}`}
			/>
		</Link>
	);
}

export default AvatarLink;