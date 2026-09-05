// Smooth cross-fade between pages: fades the page in on load and fades it
// out briefly before navigating to another page on this site.
(function () {
  const TRANSITION_MS = 150;

  document.documentElement.classList.add('is-page-fading-in');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('is-page-fading-in');
    });
  });

  window.addEventListener('pageshow', () => {
    document.documentElement.classList.remove('is-page-fading-out');
    document.documentElement.classList.remove('is-page-fading-in');
  });

  function isInternalPageLink(link) {
    if (!link || !link.href) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (error) {
      return false;
    }
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname) return false; // same page (anchors, etc.)
    return url.pathname.endsWith('.html');
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a');
    if (!isInternalPageLink(link)) return;

    event.preventDefault();
    document.documentElement.classList.add('is-page-fading-out');

    window.setTimeout(() => {
      window.location.href = link.href;
    }, TRANSITION_MS);
  });
})();
