import type { ReactNode } from 'react';
import NeonCard from './NeonCard';

interface HomeModuleProps {
	title: string;
	children: ReactNode;
}

function HomeModule({ title, children }: HomeModuleProps) {
	return (
		<NeonCard className="flex min-h-0 flex-1 flex-col">
			<div className="m-[7px] rounded-[8px_8px_0_0] border-b border-[var(--color-accent-soft)] bg-[#81164d] px-4 py-2 shadow-[inset_0_12px_20px_-8px_#ff53ac,inset_0_-12px_20px_-8px_rgb(54,11,33),0_8px_20px_rgba(0,0,0,0.9)] max-[750px]:flex max-[750px]:justify-center">
				<h2 className="m-0 font-[var(--font-title)] text-[18px] font-bold text-[var(--color-accent-softer)] before:mr-2 before:text-[15px] before:text-[var(--color-accent-soft)] before:content-['★'] after:ml-2 after:text-[15px] after:text-[var(--color-accent-soft)] after:content-['★']">{title}</h2>
			</div>
			<div className="flex min-h-0 flex-1 flex-col p-[10px] text-[var(--color-text)]">{children}</div>
		</NeonCard>
	);
}

export default HomeModule;