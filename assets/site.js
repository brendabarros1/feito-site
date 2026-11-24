/* Feito. Comportamento compartilhado entre as páginas. */
(function () {
  var F = window.FEITO;

  // Guarda a origem da primeira visita (utm e código de indicação) para os formulários.
  function guardarOrigem() {
    try {
      var p = new URLSearchParams(location.search);
      var chaves = ['utm_source', 'utm_medium', 'utm_campaign', 'ref'];
      var atual = JSON.parse(localStorage.getItem('feito_origem') || 'null');
      var tem = chaves.some(function (k) { return p.get(k); });
      if (!atual && tem) {
        var o = {};
        chaves.forEach(function (k) { o[k] = p.get(k) || ''; });
        localStorage.setItem('feito_origem', JSON.stringify(o));
      }
    } catch (e) { /* navegador sem armazenamento: segue sem origem */ }
  }
  F.origem = function () {
    try { return JSON.parse(localStorage.getItem('feito_origem') || '{}') || {}; } catch (e) { return {}; }
  };

  function preencherComuns() {
    document.querySelectorAll('[data-whats]').forEach(function (a) {
      a.href = F.linkWhats(a.getAttribute('data-whats') || 'Oi! Vim pelo site da Feito.');
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-empresa]').forEach(function (el) { el.textContent = F.empresa; });
    document.querySelectorAll('[data-garantia]').forEach(function (el) { el.textContent = F.garantia; });
    document.querySelectorAll('[data-parcelas]').forEach(function (el) { el.textContent = F.parcelas; });
    document.querySelectorAll('[data-instagram]').forEach(function (a) { a.href = F.instagram; });
    document.querySelectorAll('[data-email-privacidade]').forEach(function (el) { el.textContent = F.emailPrivacidade; });
    var menor = F.servicos.filter(function (s) { return s.preco && !s.sufixo; })
      .reduce(function (m, s) { return Math.min(m, s.preco); }, Infinity);
    document.querySelectorAll('[data-preco-minimo]').forEach(function (el) {
      if (isFinite(menor)) el.textContent = F.formatarPreco(menor);
    });
  }

  function el(tag, attrs, filhos) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (filhos || []).forEach(function (f) { if (f) n.appendChild(f); });
    return n;
  }

  // Monta o catálogo da página inicial a partir do config.
  function montarCatalogo() {
    var grade = document.getElementById('grade-servicos');
    var mensal = document.getElementById('bloco-mensal');
    if (!grade) return;
    F.servicos.forEach(function (s) {
      if (s.destaque === 'mensal') {
        if (!mensal) return;
        mensal.querySelector('[data-m="tag"]').textContent = s.nome + ' · todo mês';
        mensal.querySelector('[data-m="titulo"]').textContent = s.necessidade;
        mensal.querySelector('[data-m="inclui"]').textContent = s.inclui;
        mensal.querySelector('[data-m="rotulo"]').textContent = s.rotuloPreco;
        mensal.querySelector('[data-m="preco"]').textContent = F.formatarPreco(s.preco);
        mensal.querySelector('[data-m="sufixo"]').textContent = s.sufixo || '';
        mensal.querySelector('[data-m="cta"]').href = 'contratar.html?s=' + s.slug;
        return;
      }
      var combo = s.destaque === 'combo';
      var precoTexto = s.preco ? F.formatarPreco(s.preco) : 'Fale com a gente';
      var rotulo = combo && s.precoDe
        ? el('div', { class: 'preco-rotulo' }, [document.createTextNode('De '), el('s', { text: F.formatarPreco(s.precoDe) }), document.createTextNode(' por')])
        : el('div', { class: 'preco-rotulo', text: s.rotuloPreco });
      var card = el('article', { class: 'card' + (combo ? ' card--creme' : '') }, [
        el('div', { class: 'card__topo' }, [
          el('span', { class: 'tag' + (s.tag === 'salvia' ? ' tag--salvia' : s.tag === 'coral' ? ' tag--coral' : ''), text: s.nome }),
          el('span', { text: combo ? 'combo' : s.prazoDias + ' dias úteis' })
        ]),
        el('h3', { class: 'display h-card', text: s.necessidade }),
        el('p', { text: s.inclui }),
        el('div', { class: 'muted', style: 'font-size:14px', text: s.ajustes }),
        el('div', { class: 'card__rodape' }, [
          el('div', {}, [rotulo, el('div', { class: 'preco', text: precoTexto })]),
          el('a', { class: 'btn btn--escuro btn--sm', href: 'contratar.html?s=' + s.slug, text: combo ? 'Quero o combo' : 'Quero esse' })
        ])
      ]);
      grade.appendChild(card);
    });
  }

  guardarOrigem();
  document.addEventListener('DOMContentLoaded', function () {
    preencherComuns();
    montarCatalogo();
  });
})();
