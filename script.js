const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');
const languageSelects = document.querySelectorAll('[data-language-select]');

if (navToggle && navLinks && navActions) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    document.body.classList.toggle('nav-open', !isOpen);
  });
}

document.querySelectorAll('.filter-row button, .booking-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    if (!group) return;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

const fallbackLocales = {
  en: {
    'common.getItNow': 'Get it now',
    'common.signIn': 'Sign in',
    'common.search': 'Search',
    'common.book': 'Book',
    'nav.home': 'HOME',
    'nav.destination': 'Destination',
    'nav.activity': 'Activity',
    'price.perPerson': '/ person',
    'home.searchPlaceholder': 'What are you looking for ?'
  }
};

const languageMeta = {
  en: { htmlLang: 'en' },
  ms: { htmlLang: 'ms' },
  zh: { htmlLang: 'zh-CN' }
};

function applyLanguage(locales, language) {
  const dictionary = locales[language] || locales.en || {};
  document.documentElement.lang = languageMeta[language]?.htmlLang || 'en';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const value = dictionary[element.dataset.i18nPlaceholder];
    if (value) element.setAttribute('placeholder', value);
  });
  languageSelects.forEach((select) => {
    select.value = language;
  });
}

async function loadLocales() {
  try {
    const response = await fetch('locales.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Failed to load locales: ${response.status}`);
    return response.json();
  } catch {
    return fallbackLocales;
  }
}

if (languageSelects.length) {
  loadLocales().then((locales) => {
    const savedLanguage = localStorage.getItem('siteLanguage') || 'en';
    const initialLanguage = locales[savedLanguage] ? savedLanguage : 'en';
    applyLanguage(locales, initialLanguage);
    languageSelects.forEach((select) => {
      select.addEventListener('change', () => {
        localStorage.setItem('siteLanguage', select.value);
        applyLanguage(locales, select.value);
      });
    });
  });
}
