module.exports = {
  trailingSlash: true,
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL || '',

    API_URL: process.env.API_URL,
    CAPTCHA_KEY: process.env.CAPTCHA_KEY,

    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY
  },
  redirects() {
    return [
      false // Set true to activate maintenance mode.
        ? {
            source: '/((?!maintenance)(?!_next)(?!assets)(?!static).*)',
            destination: '/maintenance',
            permanent: false
          }
        : null
    ].filter(Boolean);
  }
};
