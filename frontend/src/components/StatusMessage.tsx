import './StatusMessage.css';

interface StatusMessageProps {
	message: string;
	className?: string;
}

function StatusMessage({ message, className = '' }: StatusMessageProps) {
	return (
		<p className={`status-message ${className}`}>
			{message}
		</p>
	);
}

export default StatusMessage;