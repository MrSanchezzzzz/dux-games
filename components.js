(function () {
  function define(tag, render) {
    customElements.define(tag, class extends HTMLElement {
      connectedCallback() {
        this.insertAdjacentHTML('afterend', render(this.getAttribute('base') || ''));
        this.remove();
      }
    });
  }

  define('dux-nav', function (b) {
    var prefix = b ? b + 'index.html' : '';
    return (
      '<header class="nav">' +
        '<div class="container nav-inner">' +
          '<a class="brand" href="' + (b ? b + 'index.html' : '#top') + '" aria-label="DUX Games — home">' +
            '<img src="' + b + 'assets/dux-logo-horizontal-white.png" alt="DUX Games" />' +
          '</a>' +
          '<button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<nav class="nav-links" id="navLinks">' +
            '<a class="link" href="' + prefix + '#games">Games</a>' +
            '<a class="link" href="' + prefix + '#journal">Journal</a>' +
            '<a class="link" href="' + prefix + '#contact">Contact</a>' +
            '<a class="btn btn-primary" href="' + b + 'wincode-98/index.html">Play WinCode 98 <span class="arrow">↗</span></a>' +
          '</nav>' +
        '</div>' +
      '</header>'
    );
  });

  define('dux-footer', function (b) {
    return (
      '<footer class="footer">' +
        '<div class="container footer-inner">' +
          '<div class="left">' +
            '<img src="' + b + 'assets/dux-duck-mark.png" alt="DUX Games" />' +
            '<span class="copy">© 2026 DUX Games</span>' +
          '</div>' +
          '<div class="socials">' +
            '<a href="#">X</a>' +
            '<a href="#">Discord</a>' +
            '<a href="mailto:kremenchuksh@gmail.com">Email</a>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  });

  define('dux-to-top', function () {
    return (
      '<button class="to-top" id="toTop" aria-label="Back to top">' +
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">' +
          '<path d="M6 10V2M6 2L2 6M6 2l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        'Top' +
      '</button>'
    );
  });
})();
