
import { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import './Auth.css'; 

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const pageTitle = isLogin ? ':: LOGIN :: LETTERBLOG-AUTH v1.0' : ':: REGISTER :: SIGN-UP HERE';

  return (
    <div className="skyblog-container">
      <div className="skyblog-box">
        
        <div className="skyblog-header">
          {pageTitle}
        </div>

        <div className="skyblog-content">
          {isLogin ? (
            <Login onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <Register onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>

      <footer className="retro-footer">
        © 2004 SKiiBlog Enterprises LLC. Best viewed in Internet Explorer 6.0
      </footer>
    </div>
  );
}