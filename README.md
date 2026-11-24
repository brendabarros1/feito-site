# Site da Feito

Site estático (HTML, CSS e JavaScript puros), hospedado no Netlify, com formulários pelo Netlify Forms.

## Páginas

| Arquivo | O que é |
| --- | --- |
| `index.html` | Página inicial com catálogo, como funciona, garantia, Raio-X e dúvidas |
| `contratar.html?s=<serviço>` | Formulário de contratação em 3 etapas (dados, briefing, aceite) |
| `obrigado.html` | Confirmação do pedido com o botão de pagamento |
| `raio-x.html` | Raio-X em 2 minutos: 8 perguntas, cadastro e resultado |
| `termos.html`, `privacidade.html` | Textos provisórios, pendentes de revisão jurídica |

## Onde mudar preço, prazo, WhatsApp e links de pagamento

Tudo fica em **`assets/config.js`**. O site inteiro lê desse arquivo: catálogo, formulário, confirmação e Raio-X. Não repita valores no HTML.

Antes de publicar, preencha em `assets/config.js`:

- `whatsapp`: número com DDI e DDD, só dígitos
- `garantia`: a condição da garantia de prazo
- `empresa`: razão social e CNPJ
- `emailPrivacidade`: e-mail para pedidos de dados (LGPD)
- `parcelas`: número máximo de parcelas no cartão
- `linkPagamento` de cada serviço: o link do Mercado Pago (deixe vazio enquanto não tiver; a confirmação manda a pessoa para o WhatsApp)
- `preco` do Feito Começo (está `null`)

## Formulários

O Netlify detecta os formulários `pedido` e `raio-x` na publicação. As respostas aparecem em Netlify › Forms. Configure lá a notificação por e-mail a cada envio.

Os arquivos dos clientes são pedidos como **link** (Drive, Dropbox) e não como anexo, para não esbarrar no limite de tamanho de envio do Netlify.

## Fluxo de publicação

- `rascunho`: ramo de trabalho. Alterações entram aqui primeiro.
- `main`: o site no ar. O Netlify publica só este ramo.

Cada publicação de `main` consome créditos do plano gratuito do Netlify. Junte as alterações em `rascunho` e leve para `main` de uma vez.
