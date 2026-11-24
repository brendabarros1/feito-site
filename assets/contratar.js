/* Feito. Formulário de contratação (Netlify Forms). */
document.addEventListener('DOMContentLoaded', function () {
  var F = window.FEITO;
  var form = document.getElementById('form-pedido');
  var select = document.getElementById('servico-select');
  var erro = document.getElementById('erro');
  var btnAvancar = document.getElementById('btn-avancar');
  var btnEnviar = document.getElementById('btn-enviar');
  var btnVoltar = document.getElementById('btn-voltar');
  var etapas = { 1: 'Seus dados', 2: 'Briefing', 3: 'Revisão e aceite' };
  var etapa = 1;
  var CHAVE = 'feito_rascunho_pedido';

  var params = new URLSearchParams(location.search);
  var slug = params.get('s');
  if (!F.servico(slug)) slug = 'marca';

  F.servicos.forEach(function (s) {
    var o = document.createElement('option');
    o.value = s.slug;
    o.textContent = s.nome + ' · ' + (s.preco ? F.formatarPreco(s.preco) + (s.sufixo || '') : 'preço a combinar');
    select.appendChild(o);
  });
  select.value = slug;
  select.addEventListener('change', function () {
    slug = select.value;
    history.replaceState(null, '', '?s=' + slug);
    aplicarServico();
  });

  function aplicarServico() {
    var s = F.servico(slug);
    document.getElementById('resumo-nome').textContent = s.nome;
    document.getElementById('resumo-rotulo').textContent = s.rotuloPreco;
    document.getElementById('resumo-preco').textContent = s.preco ? F.formatarPreco(s.preco) + (s.sufixo || '') : 'a combinar';
    document.getElementById('resumo-prazo').textContent = s.prazoDias ? s.prazoDias + ' dias úteis' : 'mensal';
    document.title = 'Contratar ' + s.nome + ' · Feito';
    form.querySelectorAll('[data-servicos]').forEach(function (fs) {
      var ativo = fs.getAttribute('data-servicos').split(' ').indexOf(slug) >= 0;
      fs.hidden = !ativo;
      fs.disabled = !ativo;
    });
  }

  // Origem da visita e código de indicação.
  var origem = F.origem();
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
    form.elements[k].value = origem[k] || '';
  });
  if (origem.ref && !form.elements.codigo_indicacao.value) form.elements.codigo_indicacao.value = origem.ref;

  // Rascunho salvo no navegador.
  function salvarRascunho() {
    try {
      var dados = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === 'hidden' || el.name === 'bot-field') return;
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked) (dados[el.name] = dados[el.name] || []).push(el.value);
        } else dados[el.name] = el.value;
      });
      localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch (e) { /* sem armazenamento */ }
  }
  function restaurarRascunho() {
    try {
      var dados = JSON.parse(localStorage.getItem(CHAVE) || 'null');
      if (!dados) return;
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !(el.name in dados) || el.type === 'hidden') return;
        if (el.name.indexOf('aceite_') === 0) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = dados[el.name].indexOf(el.value) >= 0;
        else el.value = dados[el.name];
      });
    } catch (e) { /* ignora rascunho inválido */ }
  }
  form.addEventListener('input', salvarRascunho);
  form.addEventListener('change', salvarRascunho);

  function blocoDaEtapa(n) { return form.querySelector('[data-etapa="' + n + '"]'); }

  function mostrarEtapa(n) {
    etapa = n;
    [1, 2, 3].forEach(function (i) { blocoDaEtapa(i).hidden = i !== n; });
    document.getElementById('etapa-rotulo').textContent = 'Etapa ' + n + ' de 3 · ' + etapas[n];
    document.getElementById('progresso').style.width = Math.round(n / 3 * 100) + '%';
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(n));
    document.getElementById('troca-servico').hidden = n !== 1;
    btnAvancar.hidden = n === 3;
    btnEnviar.hidden = n !== 3;
    btnVoltar.hidden = n === 1;
    erro.hidden = true;
    if (n === 3) montarRevisao();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function etapaValida(n) {
    var campos = blocoDaEtapa(n).querySelectorAll('input, select, textarea');
    for (var i = 0; i < campos.length; i++) {
      var c = campos[i];
      if (c.disabled || c.closest('[hidden]')) continue;
      if (!c.checkValidity()) {
        c.reportValidity();
        c.focus();
        return false;
      }
    }
    return true;
  }

  function montarRevisao() {
    var s = F.servico(slug);
    var v = function (n) { return (form.elements[n] && form.elements[n].value) || ''; };
    var caixa = document.getElementById('revisao');
    caixa.textContent = '';
    var linhas = [
      ['Serviço', s.nome],
      ['Valor', s.preco ? F.formatarPreco(s.preco) + (s.sufixo || '') : 'a combinar no WhatsApp'],
      ['Prazo', s.prazoDias ? s.prazoDias + ' dias úteis após briefing completo e pagamento' : 'mensal'],
      ['Nome', v('nome')], ['Negócio', v('negocio')], ['WhatsApp', v('whatsapp')], ['E-mail', v('email')]
    ];
    linhas.forEach(function (l) {
      var p = document.createElement('div');
      var b = document.createElement('b');
      b.textContent = l[0] + ': ';
      p.appendChild(b);
      p.appendChild(document.createTextNode(l[1]));
      caixa.appendChild(p);
    });
  }

  btnAvancar.addEventListener('click', function () {
    if (etapaValida(etapa)) mostrarEtapa(etapa + 1);
  });
  btnVoltar.addEventListener('click', function () { mostrarEtapa(etapa - 1); });

  function gerarCodigo() {
    var d = new Date();
    var dd = String(d.getDate()).padStart(2, '0') + String(d.getMonth() + 1).padStart(2, '0');
    return 'FT-' + dd + '-' + String(Math.floor(1000 + Math.random() * 9000));
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!etapaValida(3)) return;
    var s = F.servico(slug);
    var codigo = gerarCodigo();
    form.elements.codigo.value = codigo;
    form.elements.servico.value = s.nome;
    form.elements.preco.value = s.preco ? F.formatarPreco(s.preco) + (s.sufixo || '') : 'a combinar';
    form.elements.aceite_data.value = new Date().toISOString();
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    var corpo = new URLSearchParams(new FormData(form)).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: corpo })
      .then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        try { localStorage.removeItem(CHAVE); } catch (e) { /* ok */ }
        var primeiro = (form.elements.nome.value || '').trim().split(' ')[0];
        location.href = 'obrigado.html?c=' + encodeURIComponent(codigo) + '&s=' + slug + '&n=' + encodeURIComponent(primeiro);
      })
      .catch(function () {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Ir para o pagamento';
        erro.hidden = false;
        erro.textContent = '';
        erro.appendChild(document.createTextNode('Não conseguimos enviar seu pedido agora. Tente de novo em instantes ou '));
        var a = document.createElement('a');
        a.href = F.linkWhats('Oi! Tentei contratar o ' + s.nome + ' pelo site e deu erro no envio.');
        a.target = '_blank'; a.rel = 'noopener';
        a.textContent = 'fale com a gente no WhatsApp';
        erro.appendChild(a);
        erro.appendChild(document.createTextNode('.'));
      });
  });

  restaurarRascunho();
  aplicarServico();
  mostrarEtapa(1);
});
