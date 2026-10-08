import type { ReactNode } from 'react';
import { neonCard } from './tailwindStyles';

interface NeonCardProps {
	children: ReactNode;
	className?: string;
}

function NeonCard({ children, className = '' }: NeonCardProps) {
	return <div className={`${neonCard} ${className}`.trim()}>{children}</div>;
}

export default NeonCard;
