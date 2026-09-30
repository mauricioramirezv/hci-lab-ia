# HCI Lab + IA

[Español](README.es.md) · [English](README.en.md) · [Português](README.pt-BR.md) · [Français](README.fr.md)

Laboratório front-end, multiformato e multilíngue para ensinar, aplicar e avaliar IHC, UX, acessibilidade e inteligência artificial.

## Funcionalidades

- CRUD persistente de agendamentos: criar, reagendar e cancelar.
- Importação/exportação JSON, construtor de personas, mapa de empatia e cenários.
- Modos de boa prática, má prática e comparação.
- Visualizações para computador, tablet, celular e relógio.
- Espanhol, inglês, português e francês em tempo de execução.
- Centro de acessibilidade com temas claro/escuro, alto contraste, texto de 100–200%, espaçamento, leitura acessível e redução de movimento.
- Demonstração para leitor de tela e componente para um vídeo curto em LSC validado por especialista.
- Avaliação de Nielsen humana e com IA, severidade, evidência e validação.
- SUS, SEQ, sucesso, tempo, erros e emoção por participante.
- Métricas calculadas a partir de evidências e exportação CSV.
- Contrato extensível de IA; provedores reais exigem proxy seguro.
- Vitest, Playwright, Selenium, axe-core e guia para Katalon.
- Publicação automática no GitHub Pages.

## Instalação e execução

```bash
git clone https://github.com/mauricioramirezv/hci-lab-ia.git
cd hci-lab-ia
npm install
npm run dev
```

## Verificação

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Acessibilidade e IA

A meta educacional é WCAG 2.2 AA. Os testes automáticos devem ser complementados com teclado, ampliação, leitor de tela e usuários diversos. Chaves de IA nunca devem ficar no front-end; provedores remotos exigem um proxy seguro.

## Licença

MIT.


## Atualização multimodal 2.2.0

Nova rota `#/multimodal`: oito contextos simulados; filtros aproximados de percepção de cores; reconhecimento e síntese de voz opcionais; som e vibração com resposta visual; observações persistentes no JSON do projeto. Controles e tabela do novo módulo estão traduzidos. Algumas páginas herdadas e atividades de conceitos permanecem em espanhol. APIs dependem do navegador; o hardware real exige verificação.

See [README.md](README.md) and [ACTUALIZAR_WINDOWS.md](ACTUALIZAR_WINDOWS.md).
