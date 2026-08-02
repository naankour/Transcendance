const TMDB_LANGUAGE_MAP = {
	en: 'en-US',
	fr: 'fr-FR',
	es: 'es-ES',
};

function getTmdbLanguage(lang) {
	return TMDB_LANGUAGE_MAP[lang] || 'en-US';
}

module.exports = { getTmdbLanguage };