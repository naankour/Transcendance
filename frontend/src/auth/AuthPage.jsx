import { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { Toast } from './Toast';
import './Auth.css'; 

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    // Clear toast state after animation finishes (2.5 seconds)
    setTimeout(() => setToastMessage(''), 2500);
  };

  const pageTitle = isLogin ? ':: LOGIN :: LETTERBLOG-AUTH v1.0' : ':: REGISTER :: SIGN-UP HERE';

  return (
    <div className="skyblog-container">
      {/* Toast Popup Notification */}
      <Toast message={toastMessage} icon="💾" />

      <div className="skyblog-box">
        <div className="skyblog-header">
          {pageTitle}
        </div>

        <div className="skyblog-content">
          {isLogin ? (
            <Login 
              onSwitchToRegister={() => setIsLogin(false)} 
              triggerToast={triggerToast}
            />
          ) : (
            <Register 
              onSwitchToLogin={() => setIsLogin(true)} 
              triggerToast={triggerToast}
            />
          )}
        </div>
      </div>

      <footer className="retro-footer">
        © 2004 LetterBlog Enterprises LLC. Best viewed in Internet Explorer 6.0
      </footer>
    </div>
  );
}