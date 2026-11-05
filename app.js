(function () {
  var $ = function (id) {
    return document.getElementById(id);
  };

  var mb = $('mb');
  var nl = $('nl');
  var ck = $('ck');
  var cka = $('cka');

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

  // Informational notice only. Google's certified CMP / Privacy & messaging
  // must collect regulated ad-consent signals; dismissing this notice is not consent.
  if (ck) {
    var notice = ck.querySelector('span');
    if (notice) {
      var oldLink = notice.querySelector('a');
      var privacyHref = oldLink ? oldLink.getAttribute('href') : '/privacy';
      var privacyLink = document.createElement('a');
      privacyLink.href = privacyHref;
      privacyLink.style.color = '#fff';
      privacyLink.textContent = 'Privacy Policy';
      notice.textContent = 'RankForge uses Google AdSense. Google and its partners may use cookies or similar technologies for advertising and measurement. This notice is not a consent choice. ';
      notice.appendChild(privacyLink);
    }
    if (cka) {
      cka.textContent = 'Dismiss';
      cka.setAttribute('aria-label', 'Dismiss advertising and privacy notice');
    }
    ck.setAttribute('role', 'region');
    ck.setAttribute('aria-label', 'Advertising and privacy notice');
    try {
      if (!localStorage.getItem('rf_privacy_notice_dismissed')) ck.style.display = 'flex';
    } catch (x) {
      ck.style.display = 'flex';
    }
  }

  if (cka && ck) {
    cka.addEventListener('click', function () {
      ck.style.display = 'none';
      try { localStorage.setItem('rf_privacy_notice_dismissed', '1'); } catch (x) {}
    });
  }
})();
