import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AuthRequired.css';

interface AuthRequiredProps {
	message?: string;
}

function AuthRequired({ message }: AuthRequiredProps) {
	const { t } = useTranslation();

	let displayMessage = t('auth.requiredDefault');
	if (message) {
		displayMessage = message;
	}

	return (
        <div className="auth-required-container">
            <div className="auth-required">
                <p className="auth-required-icon">🔒</p>
                <p className="auth-required-message">{displayMessage}</p>
                <Link to="/auth" className="auth-required-button">
                    {t('auth.requiredButton')}
                </Link>
            </div>
        </div>
	);
}

export default AuthRequired;