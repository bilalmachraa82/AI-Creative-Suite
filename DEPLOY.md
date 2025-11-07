# 🚀 Deploy no Vercel - Guia Rápido

Este guia vai ajudá-lo a colocar a aplicação online em menos de 5 minutos!

## ✅ Pré-requisitos

1. **Conta no Vercel**: Crie gratuitamente em [vercel.com](https://vercel.com/signup)
2. **API Key do Gemini**: Obtenha em [ai.google.dev](https://ai.google.dev/)
3. **Vercel CLI já instalado** ✓ (já foi instalado neste projeto!)

---

## 🎯 Método 1: Deploy Automático (Mais Rápido - 2 minutos)

### Passo 1: Login no Vercel
```bash
vercel login
```
- Escolha o método de login (GitHub, GitLab, Bitbucket ou Email)
- Siga as instruções no navegador

### Passo 2: Deploy
```bash
vercel
```

Quando perguntado:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Escolha sua conta
- **Link to existing project?** → `N` (No)
- **Project name?** → Pressione Enter (usará: ai-product-photoshoot-studio)
- **Directory?** → Pressione Enter (usará: ./)
- **Override settings?** → `N` (No)

### Passo 3: Adicionar API Key
```bash
vercel env add GEMINI_API_KEY production
```
- Cole sua API key do Gemini quando solicitado
- Pressione Enter

### Passo 4: Deploy Final em Produção
```bash
vercel --prod
```

**🎉 Pronto!** A URL do seu site aparecerá no terminal!

---

## 🎯 Método 2: Deploy via Dashboard (Interface Visual)

### Passo 1: Conectar Repositório
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta do GitHub
3. Selecione o repositório `AI-Creative-Suite`
4. Clique em **Import**

### Passo 2: Configurar
- **Framework Preset**: Vite (detectado automaticamente)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Passo 3: Adicionar Variável de Ambiente
1. Clique em **Environment Variables**
2. Adicione:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `sua_api_key_aqui`
   - **Environment**: Production
3. Clique em **Add**

### Passo 4: Deploy
1. Clique em **Deploy**
2. Aguarde 1-2 minutos
3. **🎉 Site publicado!**

---

## 🔑 Como Obter a API Key do Gemini

1. Acesse [ai.google.dev](https://ai.google.dev/)
2. Clique em **Get API Key** no topo
3. Faça login com sua conta Google
4. Clique em **Create API Key**
5. Selecione ou crie um projeto
6. **Copie a API key** gerada
7. Cole na variável de ambiente no Vercel

**⚠️ IMPORTANTE**:
- Nunca compartilhe sua API key
- Não faça commit da key no código
- Use apenas em variáveis de ambiente

---

## 📊 Após o Deploy

### URLs Típicas:
- **Production**: `https://ai-creative-suite.vercel.app`
- **Preview**: `https://ai-creative-suite-git-branch.vercel.app`

### Testar Funcionalidades:
- [ ] Site carrega corretamente
- [ ] Upload de imagens funciona
- [ ] Gerar Fotos de Produto
- [ ] Editar com IA
- [ ] Gerar Imagem
- [ ] Gerar Vídeo (requer seleção de API key adicional)
- [ ] Gerar Conteúdo

### Monitoramento:
- **Analytics**: Dashboard do Vercel → Analytics
- **Logs**: Dashboard → Logs
- **Performance**: Dashboard → Speed Insights

---

## 🔧 Comandos Úteis

```bash
# Ver status do projeto
vercel ls

# Ver deployments
vercel inspect [url]

# Adicionar mais variáveis de ambiente
vercel env add [NOME] production

# Remover projeto (cuidado!)
vercel remove [nome-do-projeto]

# Ver logs em tempo real
vercel logs [url] --follow

# Promover preview para produção
vercel promote [deployment-url]
```

---

## 🎨 Customizar Domínio (Opcional)

### Domínio Gratuito do Vercel:
Seu app já tem um domínio: `*.vercel.app`

### Domínio Personalizado:
1. Dashboard → Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Aguarde propagação (até 48h)

---

## 🐛 Troubleshooting

### Build falha?
```bash
# Teste local primeiro
npm run build

# Veja erros
vercel logs [url]
```

### API não funciona?
1. Verifique se `GEMINI_API_KEY` está configurada
2. Teste a key em [aistudio.google.com](https://aistudio.google.com)
3. Verifique quota da API

### Site muito lento?
1. Dashboard → Analytics
2. Ative **Speed Insights** (gratuito)
3. Siga recomendações de otimização

---

## 💡 Dicas Pro

### Deploy Automático:
Cada push no GitHub faz deploy automático! 🚀

### Preview Deployments:
Cada PR cria uma preview URL para testar

### Rollback Rápido:
Dashboard → Deployments → Promote (para voltar versão)

### Monitoramento:
Configure notificações em Settings → Notifications

---

## 📞 Suporte

- **Documentação**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [vercel.com/community](https://vercel.com/community)
- **Status**: [vercel-status.com](https://vercel-status.com)

---

**🎉 Boa sorte com o deploy!**

Se tiver problemas, veja os logs do Vercel ou abra uma issue no GitHub.
