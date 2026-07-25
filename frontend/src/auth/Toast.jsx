
import './Auth.css';

export function Toast({ message, icon = '📟' }) {
  if (!message) return null;

  return (
    <div className="retro-toast-container">
      <div className="retro-toast">
        <span className="retro-toast-icon">{icon}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}