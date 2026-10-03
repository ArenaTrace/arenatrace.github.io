// 一覧の絞り込みと並び替え。フレームワークは使わない。
(function () {
  var list = document.getElementById('rows');
  if (!list) return;
  var rows   = Array.prototype.slice.call(list.querySelectorAll('.row'));
  var q      = document.getElementById('q');
  var future = document.getElementById('future');
  var count  = document.getElementById('count');
  var empty  = document.getElementById('empty');
  var chips  = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var sorts  = Array.prototype.slice.call(document.querySelectorAll('.sort'));
  var state  = { text: '', pref: '', key: 'cap', dir: 'desc', future: false };

  // 会場ページのパンくずから /?pref=北海道 で飛んでくる
  var initial = new URLSearchParams(location.search).get('pref') || '';

  function norm(s) {
    // カタカナをひらがなに寄せて、ゆれを吸収する
    return s.toLowerCase().replace(/[ァ-ヶ]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0x60);
    });
  }

  function apply() {
    var shown = 0;
    var text = norm(state.text.trim());
    rows.forEach(function (r) {
      var hit = true;
      if (!state.future && r.dataset.future) hit = false;
      if (hit && state.pref && r.dataset.pref !== state.pref) hit = false;
      if (hit && text) {
        hit = norm(r.dataset.name + r.dataset.pref + r.textContent).indexOf(text) !== -1;
      }
      r.hidden = !hit;
      if (hit) shown++;
    });

    var sorted = rows.slice().sort(function (a, b) {
      var x, y;
      if (state.key === 'name') { x = a.dataset.name; y = b.dataset.name; return state.dir === 'asc' ? x.localeCompare(y, 'ja') : y.localeCompare(x, 'ja'); }
      x = Number(a.dataset[state.key]); y = Number(b.dataset[state.key]);
      if (x === y) return a.dataset.name.localeCompare(b.dataset.name, 'ja');
      return state.dir === 'asc' ? x - y : y - x;
    });
    sorted.forEach(function (r) { list.appendChild(r); });

    count.textContent = shown + ' 会場';
    empty.hidden = shown !== 0;
  }

  q.addEventListener('input', function () { state.text = q.value; apply(); });
  future.addEventListener('change', function () { state.future = future.checked; apply(); });

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (o) { o.classList.remove('is-on'); });
      c.classList.add('is-on');
      state.pref = c.dataset.pref;
      apply();
    });
  });

  sorts.forEach(function (s) {
    s.addEventListener('click', function () {
      if (state.key === s.dataset.sort) {
        state.dir = state.dir === 'desc' ? 'asc' : 'desc';
      } else {
        state.key = s.dataset.sort;
        state.dir = s.dataset.sort === 'name' ? 'asc' : 'desc';
      }
      sorts.forEach(function (o) { o.classList.remove('is-on'); o.removeAttribute('data-dir'); });
      s.classList.add('is-on');
      s.setAttribute('data-dir', state.dir);
      apply();
    });
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === '/' && document.activeElement !== q) { ev.preventDefault(); q.focus(); }
    if (ev.key === 'Escape' && document.activeElement === q) { q.value = ''; state.text = ''; apply(); q.blur(); }
  });

  if (initial) {
    var match = chips.filter(function (c) { return c.dataset.pref === initial; })[0];
    if (match) { chips.forEach(function (o) { o.classList.remove('is-on'); }); match.classList.add('is-on'); state.pref = initial; }
  }

  apply();
})();

// LP。読み進めたところだけ現れる。IntersectionObserver が無い環境では最初から出す。
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(els, function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  Array.prototype.forEach.call(els, function (el) { io.observe(el); });
})();
