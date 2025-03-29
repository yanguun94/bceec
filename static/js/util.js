const API_URL = 'https://bceec.arkaive.org/ghost/api/content';
const API_KEY = '09e290016615f6d73b26b51072';

window.api = async (...args) => {
  let [resource, config] = args;
  if (resource.startsWith('/')) {
    resource = API_URL + resource;
  }

  const url = new URL(resource);
  url.searchParams.set('key', API_KEY);

  const response = await window.fetch(url.toString(), config);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function loadCSS (href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};

export { loadCSS };