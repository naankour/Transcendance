interface ProfileCardProps {
	name: string;
	avatarUrl: string;
	onClick: () => void;
}

function ProfileCard({ name, avatarUrl, onClick }: ProfileCardProps) {
	return (
		<div
			className="group relative flex min-w-0 cursor-pointer flex-col items-center rounded-[6px] border border-[var(--border)] bg-gradient-to-b from-[rgba(255,46,154,0.05)] to-[rgba(0,0,0,0.25)] p-[10px] text-center transition hover:-translate-y-1 hover:border-[var(--accent)] hover:from-[rgba(255,46,154,0.12)] hover:to-[rgba(0,0,0,0.3)] hover:shadow-[0_0_6px_var(--accent),0_0_16px_rgba(255,46,154,0.3)] max-[750px]:p-[7px]"
			onClick={onClick}
		>
			<img
				src={avatarUrl}
				alt={name}
				className="h-[180px] w-[140px] rounded-[4px] border-[3px] border-[var(--bg)] object-cover outline outline-1 outline-[var(--color-accent-soft)] shadow-[0_0_0_1px_var(--bg),0_0_7px_rgba(255,46,154,0.3)] max-[750px]:h-[145px] max-[750px]:w-[110px] max-[450px]:h-[160px] max-[450px]:w-[120px]"
			/>
			<p className="my-[10px] w-full overflow-hidden text-center text-[14px] font-semibold leading-[1.35] text-[var(--text)]">{name}</p>
		</div>
	);
}

export default ProfileCard;
