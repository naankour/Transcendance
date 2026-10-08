import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { neonButton } from './tailwindStyles';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

function NeonButton({ children, className = '', ...props }: NeonButtonProps) {
	return (
		<button className={`${neonButton} ${className}`.trim()} {...props}>
			{children}
		</button>
	);
}

export default NeonButton;
