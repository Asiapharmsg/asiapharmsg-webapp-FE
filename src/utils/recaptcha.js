// Google reCAPTCHA v3 (score-based, invisible). Loads Google's script once and
// returns a short-lived token for the given action on demand. The backend
// verifies the token, checks the action name and the score.
const SITE_KEY = process.env.CAPTCHA_KEY;
const SCRIPT_ID = 'recaptcha-v3';

let loading = null;

const loadScript = () => {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.grecaptcha && window.grecaptcha.execute) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      const wait = () =>
        window.grecaptcha ? resolve() : setTimeout(wait, 100);
      return wait();
    }
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error('reCAPTCHA script failed to load'));
    };
    document.head.appendChild(s);
  });
  return loading;
};

export const getCaptchaToken = async (action) => {
  if (!SITE_KEY) throw new Error('CAPTCHA_KEY is not configured');
  await loadScript();
  await new Promise((resolve) => window.grecaptcha.ready(resolve));
  return window.grecaptcha.execute(SITE_KEY, { action });
};
