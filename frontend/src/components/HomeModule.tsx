import type { ReactNode } from 'react';
import './HomeModule.css';

interface HomeModuleProps {
	title: string;
	children: ReactNode;
}

function HomeModule({ title, children }: HomeModuleProps) {
	return (
		<section className="home-module">
			<div className="home-module-banner">
				<h2 className="home-module-title">{title}</h2>
			</div>
			<div className="home-module-content">
				{children}
			</div>
		</section>
	);
}

export default HomeModule;