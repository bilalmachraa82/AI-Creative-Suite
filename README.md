<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# ✨ AI Creative Suite

**Experiência visual imersiva para criação de conteúdo com IA generativa**

[![Deploy com Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bilalmachraa82/AI-Creative-Suite)

[Demo](https://ai.studio/apps/drive/17sOYM3qgMLgtDRfF4LM_oE7c21uSWJAT) • [Documentação](#-funcionalidades) • [Deploy](#-deploy)

</div>

---

## 🎨 Sobre o Projeto

AI Creative Suite é uma aplicação web de última geração que une design futurista com o poder da IA generativa do Google Gemini. Interface ultra-moderna com glassmorfismo, animações 3D e experiência personalizada.

### ✨ Funcionalidades

- **📸 Photoshoot de Produto** - Gera 5 fotos profissionais a partir de uma única imagem
- **🚀 Processamento em Lote** - Processa múltiplas imagens simultaneamente (4 concurrent)
- **✨ Editar com IA** - Edições mágicas através de comandos de texto
- **🎨 Gerar Imagem** - Cria imagens únicas a partir de descrições (text-to-image)
- **🎬 Gerar Vídeo** - Transforma imagens em vídeos animados com Veo
- **📝 Gerar Conteúdo** - Cria descrições e legendas para redes sociais

### 🎯 Destaques da UI

- Design system 2025 com gradientes vibrantes e efeitos metálicos
- Glassmorfismo e neumorfismo em todos componentes
- Animações cinemáticas e microinterações avançadas
- Efeitos 3D com parallax que respondem ao mouse
- Personalização por contexto (horário, tipo de tarefa)
- 100% responsivo e acessível (WCAG AA)

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- API Key do Google Gemini ([obter aqui](https://ai.google.dev/))

### Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/bilalmachraa82/AI-Creative-Suite.git
cd AI-Creative-Suite

# 2. Instale dependências
npm install

# 3. Configure a API key
cp .env.example .env.local
# Edite .env.local e adicione: GEMINI_API_KEY=sua_key_aqui

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🌐 Deploy

### Deploy Rápido no Vercel (Recomendado)

```bash
# 1. Login no Vercel
vercel login

# 2. Deploy
vercel

# 3. Adicione a API key
vercel env add GEMINI_API_KEY production

# 4. Deploy em produção
vercel --prod
```

**📖 Guia completo:** [DEPLOY.md](./DEPLOY.md)

[![Deploy com Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bilalmachraa82/AI-Creative-Suite)

---

## 🛠️ Tecnologias

- **Frontend**: React 19, TypeScript, Vite
- **UI**: TailwindCSS, Custom CSS (Glassmorphism, Neumorphism)
- **IA**: Google Gemini (2.5 Flash, Imagen 4.0, Veo 3.1, Gemini 2.5 Pro)
- **Utilities**: React Dropzone, JSZip, Marked
- **Deploy**: Vercel (recomendado) ou Netlify

---

## 📚 Documentação

- **[CLAUDE.md](./CLAUDE.md)** - Arquitetura e contexto técnico
- **[DEPLOY.md](./DEPLOY.md)** - Guia completo de deploy
- **[.env.example](./.env.example)** - Template de variáveis de ambiente

---

## 🎯 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (porta 3000)
npm run build    # Build de produção
npm run preview  # Preview do build
```

---

## 🌟 Features em Destaque

### Design System Avançado
- 600+ linhas de CSS customizado
- Paleta de cores vibrantes com 7 gradientes únicos
- Animações suaves com cubic-bezier otimizado
- Background animado com breathing e floating particles

### Performance & Acessibilidade
- Suporte a `prefers-reduced-motion`
- ARIA labels e semantic HTML
- Focus states consistentes
- Otimizado para mobile-first

### Integração com Gemini
- 4 modelos de IA diferentes para tarefas específicas
- Polling inteligente para operações assíncronas
- Error handling robusto com retry logic
- Toast notifications contextuais

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é fornecido "como está" para fins educacionais e de demonstração.

---

## 🙏 Agradecimentos

- Google Gemini pela API de IA generativa
- Vercel pelo hosting excepcional
- Comunidade open source pelas bibliotecas incríveis

---

<div align="center">

**Criado com 💜 usando Gemini AI**

[⬆ Voltar ao topo](#-ai-creative-suite)

</div>
