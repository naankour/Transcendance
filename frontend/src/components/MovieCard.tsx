interface MovieCardProps {
	title: string;
	year?: string;
	posterUrl: string | null;
	onClick: () => void;
	className?: string;
}

function MovieCard({ title, year, posterUrl, onClick, className = '' }: MovieCardProps) {
	return (
		<div
			className={`group relative flex min-w-0 cursor-pointer flex-col items-center rounded-[6px] border border-[var(--border)] bg-gradient-to-b from-[rgba(255,46,154,0.05)] to-[rgba(0,0,0,0.25)] p-[10px] transition hover:-translate-y-1 hover:border-[var(--accent)] hover:from-[rgba(255,46,154,0.12)] hover:to-[rgba(0,0,0,0.3)] hover:shadow-[0_0_6px_var(--accent),0_0_16px_rgba(255,46,154,0.3)] max-[750px]:p-[7px] ${className}`.trim()}
			onClick={onClick}
		>
			{posterUrl && (
				<img
					src={posterUrl}
					alt={title}
					className="h-[215px] w-full rounded-[3px] border-2 border-[var(--bg)] object-cover outline outline-1 outline-[var(--border)] shadow-[0_0_0_1px_var(--bg),0_0_6px_rgba(255,46,154,0.25)] max-[750px]:h-[175px] max-[450px]:h-[210px]"
				/>
			)}
			<p className="my-[10px] w-full overflow-hidden text-center text-[14px] font-semibold leading-[1.35] text-[var(--text)]">
				{title} {year && `(${year})`}
			</p>
		</div>
	);
}

export default MovieCard;
