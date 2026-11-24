/* Feito. Raio-X em 2 minutos. */
document.addEventListener('DOMContentLoaded', function () {
  var F = window.FEITO;

  var ICONES = {
    marca: 'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',
    instagram: 'M4 4h16v16H4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 7h.01',
    google: 'M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    site: 'M3 5h18v14H3zM3 9h18M7 7h.01',
    video: 'M4 6h12v12H4zM16 10l4-2.5v9L16 14'
  };
  var AREAS = [
    { chave: 'marca', nome: 'Marca' }, { chave: 'instagram', nome: 'Instagram' }, { chave: 'google', nome: 'Google' },
    { chave: 'site', nome: 'Site' }, { chave: 'video', nome: 'Vídeo' }
  ];
  var PERGUNTAS = [
    { area: 'marca', texto: 'Seu negócio tem logotipo e cores definidos?', opcoes: ['Ainda não tenho logotipo', 'Tenho, mas fiz às pressas e não gosto', 'Tenho e gosto do resultado'] },
    { area: 'marca', texto: 'Sua marca aparece igual no Instagram, no WhatsApp e na fachada ou nos materiais?', opcoes: ['Cada lugar está de um jeito', 'Mais ou menos parecido', 'Sempre igual'] },
    { area: 'instagram', texto: 'Quem chega no seu Instagram entende em 5 segundos o que você faz e como contratar?', opcoes: ['Acho que não', 'Mais ou menos', 'Sim, está bem claro'] },
    { area: 'instagram', texto: 'Com que frequência você publica no Instagram?', opcoes: ['Quase nunca', 'Quando sobra tempo', 'Toda semana, com planejamento'] },
    { area: 'google', texto: 'Seu negócio aparece no Google Maps com fotos, horário e serviços?', opcoes: ['Não aparece', 'Aparece, mas incompleto ou desatualizado', 'Aparece completo e atualizado'] },
    { area: 'google', texto: 'Você pede avaliação no Google para clientes satisfeitos?', opcoes: ['Nunca pedi', 'Às vezes', 'Sempre'] },
    { area: 'site', texto: 'Quando alguém pede um link para conhecer seu negócio, o que você manda?', opcoes: ['Só o Instagram ou nada', 'Um link de bio ou catálogo', 'Meu próprio site'] },
    { area: 'video', texto: 'Você usa vídeos curtos, como Reels, para mostrar seu trabalho?', opcoes: ['Nunca', 'De vez em quando, sem edição', 'Com frequência e bem editados'] }
  ];
  var DICAS = {
    marca: 'Defina logotipo e duas cores e use igual em todos os canais. Consistência é o que faz o cliente lembrar de você.',
    instagram: 'Reescreva a bio dizendo o que você faz, para quem e como contratar, e organize os destaques por serviço.',
    google: 'Complete o Perfil da Empresa com horário, fotos e serviços, e peça avaliação a cada cliente satisfeito.',
    site: 'Tenha uma página própria com serviços, WhatsApp e mapa. Ela passa a confiança que o Instagram sozinho não passa.',
    video: 'Publique um vídeo curto por semana mostrando o trabalho sendo feito. É o formato que mais alcança gente nova.'
  };
  // Área fraca -> slug do serviço no config.
  var SERVICO_DA_AREA = { marca: 'marca', instagram: 'perfil', google: 'google', site: 'site', video: 'video' };

  var respostas = new Array(PERGUNTAS.length).fill(null);
  var atual = 0;
  var telas = ['intro', 'pergunta', 'cadastro', 'resultado'];
  var $ = function (id) { return document.getElementById(id); };

  function mostrar(tela) {
    telas.forEach(function (t) { $('tela-' + t).hidden = t !== tela; });
    window.scrollTo({ top: 0 });
  }

  function mostrarPergunta(i) {
    atual = i;
    var p = PERGUNTAS[i];
    var area = AREAS.find(function (a) { return a.chave === p.area; });
    $('q-num').textContent = 'Pergunta ' + (i + 1) + ' de ' + PERGUNTAS.length;
    $('q-area').textContent = area.nome;
    $('q-progresso').style.width = Math.round((i + 1) / PERGUNTAS.length * 100) + '%';
    document.querySelector('#tela-pergunta [role="progressbar"]').setAttribute('aria-valuenow', String(i + 1));
    $('q-icone').setAttribute('d', ICONES[p.area]);
    $('q-texto').textContent = p.texto;
    var box = $('q-opcoes');
    box.textContent = '';
    p.opcoes.forEach(function (rotulo, j) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.setAttribute('aria-pressed', respostas[i] === j ? 'true' : 'false');
      var letra = document.createElement('span');
      letra.className = 'opt__letra';
      letra.textContent = 'ABC'[j];
      letra.setAttribute('aria-hidden', 'true');
      var txt = document.createElement('span');
      txt.textContent = rotulo;
      b.appendChild(letra); b.appendChild(txt);
      b.addEventListener('click', function () {
        respostas[i] = j;
        if (i + 1 < PERGUNTAS.length) mostrarPergunta(i + 1);
        else { mostrar('cadastro'); $('cad-titulo').focus(); }
      });
      box.appendChild(b);
    });
    mostrar('pergunta');
    $('q-texto').focus();
  }

  function calcular() {
    var nota = {};
    AREAS.forEach(function (a) {
      var idx = [];
      PERGUNTAS.forEach(function (p, i) { if (p.area === a.chave) idx.push(i); });
      var soma = idx.reduce(function (acc, i) { return acc + (respostas[i] || 0); }, 0);
      nota[a.chave] = Math.round(soma / (idx.length * 2) * 100);
    });
    var total = Math.round(respostas.reduce(function (acc, v) { return acc + (v || 0); }, 0) / (PERGUNTAS.length * 2) * 100);
    // Desempate: o que é base e mais barato primeiro.
    var ordem = ['marca', 'google', 'instagram', 'site', 'video'];
    var ranking = ordem.slice().sort(function (a, b) { return nota[a] - nota[b] || ordem.indexOf(a) - ordem.indexOf(b); });
    var fracas = ordem.filter(function (k) { return nota[k] < 50; });
    var rec = SERVICO_DA_AREA[ranking[0]];
    if (fracas.length >= 3 && nota.marca < 50) rec = 'comeco';
    else if (ranking[0] === 'instagram' && (respostas[3] || 0) === 0 && (respostas[2] || 0) >= 1) rec = 'mensal';
    return { nota: nota, total: total, ranking: ranking, rec: rec };
  }

  function corDa(v) { return v < 40 ? '#FF795F' : (v < 70 ? '#E8A33D' : '#5E9C76'); }

  function mostrarResultado(r, quem) {
    var faixa = 'Bem feito.', texto = 'Sua base está sólida. Agora o ganho vem de constância e de ajustes finos nas áreas abaixo.';
    if (r.total < 40) { faixa = 'Precisa de atenção.'; texto = 'Hoje seu negócio perde clientes antes da primeira conversa. A boa notícia: as primeiras correções são rápidas.'; }
    else if (r.total < 70) { faixa = 'No caminho.'; texto = 'Você já tem parte da base. Corrigindo as duas áreas mais fracas, o cliente passa a confiar antes de chamar.'; }
    $('r-nota').textContent = r.total;
    $('r-nota-sr').textContent = 'Nota geral: ' + r.total + ' de 100.';
    $('r-quem').textContent = 'Raio-X de ' + quem;
    $('r-faixa').textContent = faixa;
    $('r-texto').textContent = texto;

    var areas = $('r-areas');
    areas.textContent = '';
    AREAS.forEach(function (a) {
      var v = r.nota[a.chave];
      var linha = document.createElement('div');
      linha.style.cssText = 'display:flex;gap:14px;align-items:center';
      linha.innerHTML = '<span class="ico ico--p" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="' + ICONES[a.chave] + '"/></svg></span>' +
        '<div style="flex-grow:1;display:flex;flex-direction:column;gap:6px"><div style="display:flex;justify-content:space-between;font-weight:700"><span></span><span></span></div>' +
        '<div class="barra" role="img"><div></div></div></div>';
      var spans = linha.querySelectorAll('div > div > span');
      spans[0].textContent = a.nome;
      spans[1].textContent = v;
      var barra = linha.querySelector('.barra');
      barra.setAttribute('aria-label', a.nome + ': ' + v + ' de 100');
      barra.firstChild.style.width = v + '%';
      barra.firstChild.style.background = corDa(v);
      areas.appendChild(linha);
    });

    var dicas = $('r-dicas');
    dicas.textContent = '';
    r.ranking.slice(0, 2).forEach(function (k, i) {
      var area = AREAS.find(function (a) { return a.chave === k; });
      var d = document.createElement('div');
      d.className = 'aviso';
      d.style.cssText = 'display:flex;gap:14px';
      var n = document.createElement('div');
      n.className = 'display';
      n.style.fontSize = '20px';
      n.textContent = '0' + (i + 1);
      var corpo = document.createElement('div');
      var t = document.createElement('div');
      t.style.fontWeight = '700';
      t.textContent = area.nome;
      var p = document.createElement('div');
      p.style.color = 'var(--texto-2)';
      p.textContent = DICAS[k];
      corpo.appendChild(t); corpo.appendChild(p);
      d.appendChild(n); d.appendChild(corpo);
      dicas.appendChild(d);
    });

    var s = F.servico(r.rec);
    $('rec-nome').textContent = s.nome;
    $('rec-necessidade').textContent = s.necessidade;
    $('rec-inclui').textContent = s.inclui + (s.prazoDias && s.destaque !== 'combo' ? ' ' + s.prazoDias + ' dias úteis.' : '');
    $('rec-rotulo').textContent = s.rotuloPreco;
    $('rec-preco').textContent = s.preco ? F.formatarPreco(s.preco) + (s.sufixo || '') : 'Fale com a gente';
    $('rec-cta').href = 'contratar.html?s=' + s.slug + '&utm_source=raio-x';
    $('r-whats').href = F.linkWhats('Oi! Fiz o Raio-X no site (nota ' + r.total + ') e quero entender o ' + s.nome + '.');
    mostrar('resultado');
    $('r-faixa').focus();
  }

  $('btn-comecar').addEventListener('click', function () { mostrarPergunta(0); });
  $('btn-voltar-q').addEventListener('click', function () {
    if (atual === 0) mostrar('intro'); else mostrarPergunta(atual - 1);
  });
  $('btn-voltar-cad').addEventListener('click', function () { mostrarPergunta(PERGUNTAS.length - 1); });
  $('btn-refazer').addEventListener('click', function () {
    respostas = new Array(PERGUNTAS.length).fill(null);
    mostrar('intro');
  });

  var form = $('form-raiox');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var r = calcular();
    var origem = F.origem();
    form.elements.nota_geral.value = r.total;
    AREAS.forEach(function (a) { form.elements['nota_' + a.chave].value = r.nota[a.chave]; });
    form.elements.servico_recomendado.value = F.servico(r.rec).nome;
    form.elements.respostas.value = PERGUNTAS.map(function (p, i) { return (i + 1) + '. ' + p.opcoes[respostas[i] || 0]; }).join(' | ');
    form.elements.utm_source.value = origem.utm_source || '';
    form.elements.utm_medium.value = origem.utm_medium || '';
    form.elements.utm_campaign.value = origem.utm_campaign || '';
    form.elements.codigo_indicacao.value = origem.ref || '';
    var quem = (form.elements.negocio.value || form.elements.nome.value || 'seu negócio').trim();
    var botao = $('btn-resultado');
    botao.disabled = true;
    botao.textContent = 'Calculando...';
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      .catch(function () { /* o resultado aparece mesmo se o envio falhar */ })
      .then(function () {
        botao.disabled = false;
        botao.textContent = 'Ver meu resultado';
        mostrarResultado(r, quem);
      });
  });
});
