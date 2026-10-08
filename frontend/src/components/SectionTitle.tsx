import type { ReactNode } from 'react';
import { sectionTitle } from './tailwindStyles';

interface SectionTitleProps {
	children: ReactNode;
	className?: string;
}

function SectionTitle({ children, className = '' }: SectionTitleProps) {
	return <h2 className={`${sectionTitle} ${className}`.trim()}>{children}</h2>;
}

export default SectionTitle;
