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

  // Informational privacy notice; dismissing it is not advertising consent.
  if (ck) {
    var notice = ck.querySelector('span');
    if (notice) {
      var oldLink = notice.querySelector('a');
      var privacyHref = oldLink ? oldLink.getAttribute('href') : '/privacy';
      var privacyLink = document.createElement('a');
      privacyLink.href = privacyHref;
      privacyLink.style.color = '#fff';
      privacyLink.textContent = 'Privacy Policy';
      notice.textContent = 'RankForge does not currently load advertising or analytics scripts. This notice is informational, not ad consent. ';
      notice.appendChild(privacyLink);
    }
    if (cka) {
      cka.textContent = 'Dismiss';
      cka.setAttribute('aria-label', 'Dismiss privacy notice');
    }
    try {
      if (!localStorage.getItem('rf_privacy_notice_dismissed')) {
        ck.style.display = 'flex';
      }
    } catch (x) {
      ck.style.display = 'flex';
    }
  }

  if (cka && ck) {
    cka.addEventListener('click', function () {
      ck.style.display = 'none';
      try {
        localStorage.setItem('rf_privacy_notice_dismissed', '1');
      } catch (x) {}
    });
  }
})();
