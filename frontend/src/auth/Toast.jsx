import { useEffect, useState } from 'react';
import './Auth.css';

export function Toast({ message, icon = '📟' }) {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');
  const [displayIcon, setDisplayIcon] = useState(icon);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setDisplayIcon(icon);
      setVisible(true);
    } else {
      setVisible(false); // triggers slide-out animation
    }
  }, [message, icon]);

  if (!displayMessage) return null;

  return (
    <div className="retro-toast-container">
      <div
        className={`retro-toast ${visible ? 'toast-in' : 'toast-out'}`}
        onAnimationEnd={() => {
          if (!visible) setDisplayMessage(''); 
        }}
      >
        <span className="retro-toast-icon">{displayIcon}</span>
        <span>{displayMessage}</span>
      </div>
    </div>
  );
}