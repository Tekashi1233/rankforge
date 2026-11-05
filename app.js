(function () {
  var $ = function (id) {
    return document.getElementById(id);
  };

  var mb = $('mb');
  var nl = $('nl');

  // Mobile menu
  if (mb && nl) {
    function closeMenu() {
      nl.classList.remove('open');
      mb.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
      nl.classList.add('open');
      mb.setAttribute('aria-expanded', 'true');
    }

    function toggleMenu() {
      if (nl.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    mb.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (nl.classList.contains('open') && !nl.contains(e.target) && e.target !== mb) {
        closeMenu();
      }
    });

    // Close on Escape and return focus
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nl.classList.contains('open')) {
        closeMenu();
        mb.focus();
      }
    });
  }

  // Load the publisher's AdSense tag site-wide. Ads may not serve until Google approves the site.
  if (!document.querySelector('script[data-rankforge-adsense]')) {
    var adsense = document.createElement('script');
    adsense.async = true;
    adsense.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5929540692555853';
    adsense.crossOrigin = 'anonymous';
    adsense.setAttribute('data-rankforge-adsense', 'true');
    document.head.appendChild(adsense);
  }

  // Remove the legacy dismiss-only notice. Google Privacy & Messaging CMP
  // is responsible for collecting and managing regulated advertising consent.
  var legacyNotice = $('ck');
  if (legacyNotice) legacyNotice.remove();
})();