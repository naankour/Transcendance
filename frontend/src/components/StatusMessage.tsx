interface StatusMessageProps {
	message: string;
	className?: string;
}

function StatusMessage({ message, className = '' }: StatusMessageProps) {
	return (
		<p className={`rounded-xl border border-pink-500/40 bg-[#130b12]/70 px-4 py-3 text-sm text-pink-100/80 ${className}`.trim()}>
			{message}
		</p>
	);
}

export default StatusMessage;