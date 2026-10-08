import { Link, type LinkProps } from 'react-router-dom';
import type { ReactNode } from 'react';
import { neonLink } from './tailwindStyles';

interface HoverLinkProps extends LinkProps {
	children: ReactNode;
	className?: string;
}

function HoverLink({ children, className = '', ...props }: HoverLinkProps) {
	return (
		<Link className={`${neonLink} ${className}`.trim()} {...props}>
			{children}
		</Link>
	);
}

export default HoverLink;
