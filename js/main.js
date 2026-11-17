/* KINZORA ACADEMY - vanilla JS. No dependencies, no network calls. */
(function () {
  'use strict';
  var WA_NUMBER = '917039715727'; // +91 7039715727 (from official brochure)
  document.documentElement.classList.add('js');

  // Footer year
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile navigation
  var btn = document.querySelector('.nav-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  // Scroll reveal (CSS only animates if reduced motion is not requested)
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Enquiry tabs
  var tabs = document.querySelectorAll('[role=tab]');
  function showTab(id, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    document.querySelectorAll('.panel').forEach(function (p) { p.hidden = p.id !== id; });
  }
  if (tabs.length) {
    var ids = Array.prototype.map.call(tabs, function (t) { return t.getAttribute('aria-controls'); });
    var start = ids.indexOf(location.hash.slice(1)) > -1 ? location.hash.slice(1) : ids[0];
    showTab(start, false);
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { showTab(ids[i], false); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % ids.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + ids.length) % ids.length;
        if (n !== null) { e.preventDefault(); showTab(ids[n], true); }
      });
    });
    window.addEventListener('hashchange', function () {
      var h = location.hash.slice(1);
      if (ids.indexOf(h) > -1) showTab(h, false);
    });
  }

  // Validation helpers
  var PHONE = /^(?:\+?91)?[6-9]\d{9}$/;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function clean(s) { return String(s).replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim(); }

  function setErr(field, msg) {
    var box = document.getElementById(field.id + '-err');
    if (box) box.textContent = msg;
    if (field.type === 'checkbox') return;
    if (msg) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
  }

  function checkField(f) {
    var v = clean(f.value);
    var label = f.getAttribute('data-label') || 'This field';
    if (f.required && !v) return label + ' is required.';
    if (!v) return '';
    if (f.type === 'tel') {
      var digits = v.replace(/[\s\-()]/g, '');
      if (!PHONE.test(digits)) return 'Enter a valid 10-digit Indian mobile number (for example 98765 43210).';
    }
    if (f.type === 'email' && !EMAIL.test(v)) return 'Enter a valid email address, such as name@example.com.';
    if (f.type === 'number') {
      var n = Number(v), min = Number(f.min), max = Number(f.max);
      if (!/^\d+$/.test(v) || n < min || n > max) return 'Enter an age between ' + min + ' and ' + max + '.';
    }
    return '';
  }

  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    var fields = form.querySelectorAll('input[type=text],input[type=tel],input[type=email],input[type=number],textarea');
    var groups = form.querySelectorAll('fieldset[data-required-group]');

    fields.forEach(function (f) {
      f.addEventListener('blur', function () { setErr(f, checkField(f)); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid')) setErr(f, checkField(f)); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null, ok = true;
      fields.forEach(function (f) {
        var m = checkField(f); setErr(f, m);
        if (m) { ok = false; firstBad = firstBad || f; }
      });
      groups.forEach(function (g) {
        var any = g.querySelector('input:checked');
        var box = document.getElementById(g.id + '-err');
        if (box) box.textContent = any ? '' : 'Select at least one option.';
        if (!any) { ok = false; firstBad = firstBad || g.querySelector('input'); }
      });
      var status = form.querySelector('.form-status');
      if (!ok) {
        if (status) status.textContent = 'Please fix the highlighted fields before continuing.';
        if (firstBad) firstBad.focus();
        return;
      }

      // Build a readable WhatsApp message from visible labels and values
      var lines = ['*Kinzora Academy - ' + form.getAttribute('data-title') + '*', ''];
      fields.forEach(function (f) {
        var v = clean(f.value);
        if (v) lines.push((f.getAttribute('data-label') || f.name) + ': ' + v);
      });
      groups.forEach(function (g) {
        var picked = Array.prototype.map.call(g.querySelectorAll('input:checked'), function (c) { return c.value; });
        lines.push(g.getAttribute('data-label') + ': ' + picked.join(', '));
      });
      lines.push('', 'Sent from the Kinzora Academy website enquiry form.');
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      var w = window.open(url, '_blank', 'noopener,noreferrer');
      if (status) {
        status.textContent = w
          ? 'WhatsApp is opening with your enquiry. Review it and press send in WhatsApp. Nothing is sent until you do.'
          : 'Your browser blocked the new window. Use this link to open WhatsApp: ';
        if (!w) {
          var a = document.createElement('a');
          a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Open WhatsApp';
          status.appendChild(a);
        }
      }
    });
  });
})();
