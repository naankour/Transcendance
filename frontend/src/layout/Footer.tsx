import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
	return (
		<footer className="footer">
			<p className="footer-copyright">
				© 2026 LetterBlog
			</p>

			<nav className="footer-links" aria-label="Legal information">
				<Link to="/privacy-policy">
					Privacy Policy
				</Link>

				<Link to="/terms-of-service">
					Terms of Service
				</Link>
			</nav>
		</footer>
	);
}

export default Footer;