/*
 * Feito. Configuração única do site.
 * Preços, prazos, links de pagamento e contato ficam SÓ aqui.
 * Toda página lê deste arquivo; não repita valores no HTML.
 */
window.FEITO = {
  // WhatsApp com DDI + DDD + número, só dígitos. Ex.: 5511912345678
  whatsapp: '55XXXXXXXXXXX',
  instagram: 'https://instagram.com/feitoponto',
  parcelas: '[N]',
  // Condição da garantia de prazo, exibida no site e na confirmação.
  garantia: '[condição da garantia]',
  empresa: '[Razão social] · CNPJ [número]',
  emailPrivacidade: '[e-mail do encarregado]',

  // Ordem de exibição no catálogo. destaque: 'mensal' vira o bloco escuro; 'combo' vira o card creme.
  servicos: [
    {
      slug: 'marca', nome: 'Feito Marca', tag: 'creme', prazoDias: 7,
      necessidade: 'Quero uma marca com cara de profissional',
      inclui: 'Logotipo, versão reduzida, paleta, tipografia e aplicação no Instagram e no WhatsApp.',
      ajustes: '2 rodadas de ajuste', preco: 890, rotuloPreco: 'Preço fechado',
      // Cole aqui o link de pagamento do Mercado Pago deste serviço.
      linkPagamento: ''
    },
    {
      slug: 'perfil', nome: 'Feito Perfil', tag: 'salvia', prazoDias: 5,
      necessidade: 'Quero um Instagram que passe confiança',
      inclui: 'Bio, foto, capas de destaques e 9 posts de estreia no padrão da sua marca.',
      ajustes: '1 rodada de ajuste', preco: 590, rotuloPreco: 'Preço fechado', linkPagamento: ''
    },
    {
      slug: 'google', nome: 'Feito Google', tag: 'salvia', prazoDias: 3,
      necessidade: 'Quero ser encontrado no Google',
      inclui: 'Perfil da Empresa no Google configurado e otimizado, fotos, serviços e 4 publicações.',
      ajustes: '1 rodada de ajuste', preco: 390, rotuloPreco: 'Preço fechado', linkPagamento: ''
    },
    {
      slug: 'site', nome: 'Feito Site', tag: 'creme', prazoDias: 10,
      necessidade: 'Quero um site simples que funcione',
      inclui: 'Site de uma página, com WhatsApp, mapa e textos escritos por nós. Domínio por sua conta.',
      ajustes: '2 rodadas de ajuste', preco: 1490, rotuloPreco: 'Preço fechado', linkPagamento: ''
    },
    {
      slug: 'video', nome: 'Feito Vídeo', tag: 'creme', prazoDias: 5,
      necessidade: 'Quero vídeos curtos para Reels',
      inclui: '4 vídeos editados a partir do seu material, com legenda, trilha e capa.',
      ajustes: '1 rodada de ajuste', preco: 490, rotuloPreco: 'Preço fechado', linkPagamento: ''
    },
    {
      slug: 'comeco', nome: 'Feito Começo', tag: 'coral', destaque: 'combo', prazoDias: 10,
      necessidade: 'Abri meu negócio e preciso de tudo',
      inclui: 'Marca, Perfil e Google num cronograma só. Seu negócio estreia pronto.',
      ajustes: 'Ajustes de cada serviço incluídos',
      // null = preço ainda não definido; o site mostra "Fale com a gente".
      preco: null, precoDe: 1870, rotuloPreco: 'Combo', linkPagamento: ''
    },
    {
      slug: 'mensal', nome: 'Feito Mensal', tag: 'coral', destaque: 'mensal', prazoDias: null,
      necessidade: 'Quero tudo em dia sem pensar nisso.',
      inclui: 'Calendário, 12 posts por mês, Google sempre atualizado e um relatório simples. Sem fidelidade longa. 1 rodada de ajuste por peça.',
      ajustes: '1 rodada de ajuste por peça', preco: 990, sufixo: '/mês', rotuloPreco: 'A partir de', linkPagamento: ''
    }
  ]
};

window.FEITO.formatarPreco = function (v) {
  if (v === null || v === undefined) return 'R$ [preço]';
  return 'R$ ' + v.toLocaleString('pt-BR');
};
window.FEITO.servico = function (slug) {
  return window.FEITO.servicos.find(function (s) { return s.slug === slug; }) || null;
};
window.FEITO.linkWhats = function (texto) {
  return 'https://wa.me/' + window.FEITO.whatsapp + (texto ? '?text=' + encodeURIComponent(texto) : '');
};
