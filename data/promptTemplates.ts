/**
 * Prompt Templates Library
 * Organized by use case and AI task type
 */

export interface PromptTemplate {
    id: string;
    title: string;
    prompt: string;
    category: string;
    tabs: string[]; // Which tabs this template applies to
    icon: string;
}

export const TEMPLATE_CATEGORIES = [
    { id: 'edicao', name: '✂️ Edição', color: 'from-purple-500 to-pink-500' },
    { id: 'geracao', name: '🎨 Geração', color: 'from-cyan-500 to-blue-500' },
    { id: 'video', name: '🎬 Vídeo', color: 'from-amber-500 to-orange-500' },
    { id: 'ecommerce', name: '🛍️ E-commerce', color: 'from-green-500 to-emerald-500' },
    { id: 'social', name: '📱 Social Media', color: 'from-rose-500 to-pink-500' },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
    // === EDIÇÃO DE IMAGENS ===
    {
        id: 'edit-bg-white',
        title: 'Fundo Branco Limpo',
        prompt: 'Remove o fundo e substitui por um fundo branco puro e limpo',
        category: 'edicao',
        tabs: ['Editar com IA'],
        icon: '⬜',
    },
    {
        id: 'edit-bg-transparent',
        title: 'Remover Fundo',
        prompt: 'Remove completamente o fundo da imagem, deixando apenas o objeto principal',
        category: 'edicao',
        tabs: ['Editar com IA'],
        icon: '🔲',
    },
    {
        id: 'edit-bg-gradient',
        title: 'Fundo Gradiente Moderno',
        prompt: 'Substitui o fundo por um gradiente moderno e elegante em tons de azul e roxo',
        category: 'edicao',
        tabs: ['Editar com IA'],
        icon: '🌈',
    },
    {
        id: 'edit-bg-nature',
        title: 'Ambiente Natural',
        prompt: 'Coloca o produto num ambiente natural ao ar livre, com luz suave e vegetação',
        category: 'edicao',
        tabs: ['Editar com IA'],
        icon: '🌿',
    },
    {
        id: 'edit-lighting',
        title: 'Melhorar Iluminação',
        prompt: 'Melhora a iluminação da imagem, tornando-a mais brilhante e profissional',
        category: 'edicao',
        tabs: ['Editar com IA'],
        icon: '💡',
    },
    {
        id: 'edit-studio',
        title: 'Estúdio Profissional',
        prompt: 'Transforma a imagem para parecer tirada num estúdio fotográfico profissional com iluminação perfeita',
        category: 'edicao',
        tabs: ['Editar com IA'],
        icon: '📸',
    },
    {
        id: 'edit-luxury',
        title: 'Ambiente Luxuoso',
        prompt: 'Coloca o produto num ambiente luxuoso e sofisticado, com materiais premium ao redor',
        category: 'edicao',
        tabs: ['Editar com IA'],
        icon: '💎',
    },

    // === GERAÇÃO DE IMAGENS ===
    {
        id: 'gen-product-minimal',
        title: 'Produto Minimalista',
        prompt: 'Um produto elegante e minimalista em fundo branco, com sombras suaves, estilo flat lay fotografia profissional',
        category: 'geracao',
        tabs: ['Gerar Imagem'],
        icon: '📦',
    },
    {
        id: 'gen-mockup-laptop',
        title: 'Mockup em Laptop',
        prompt: 'Mockup profissional de um design exibido numa tela de laptop moderno, ambiente de escritório clean',
        category: 'geracao',
        tabs: ['Gerar Imagem'],
        icon: '💻',
    },
    {
        id: 'gen-mockup-phone',
        title: 'Mockup em Smartphone',
        prompt: 'Mockup de alta qualidade de um app ou design exibido num smartphone moderno, com mãos segurando',
        category: 'geracao',
        tabs: ['Gerar Imagem'],
        icon: '📱',
    },
    {
        id: 'gen-lifestyle',
        title: 'Cena Lifestyle',
        prompt: 'Cena lifestyle autêntica com produto em uso no dia-a-dia, iluminação natural, fotografia estilo editorial',
        category: 'geracao',
        tabs: ['Gerar Imagem'],
        icon: '🌟',
    },
    {
        id: 'gen-abstract',
        title: 'Arte Abstrata Moderna',
        prompt: 'Composição abstrata e moderna com formas geométricas, gradientes vibrantes e estética futurista',
        category: 'geracao',
        tabs: ['Gerar Imagem'],
        icon: '🎨',
    },
    {
        id: 'gen-3d-render',
        title: 'Renderização 3D',
        prompt: 'Renderização 3D fotorealista de alta qualidade, iluminação cinema 4D, materiais realistas e reflexos',
        category: 'geracao',
        tabs: ['Gerar Imagem'],
        icon: '🔮',
    },

    // === VÍDEO ===
    {
        id: 'video-zoom-in',
        title: 'Zoom Suave',
        prompt: 'Faz um zoom suave e lento em direção ao produto, destacando os detalhes',
        category: 'video',
        tabs: ['Gerar Vídeo'],
        icon: '🔍',
    },
    {
        id: 'video-rotate',
        title: 'Rotação 360°',
        prompt: 'Roda lentamente ao redor do produto, mostrando todos os ângulos',
        category: 'video',
        tabs: ['Gerar Vídeo'],
        icon: '🔄',
    },
    {
        id: 'video-pan-lr',
        title: 'Movimento Horizontal',
        prompt: 'Move a câmara lentamente da esquerda para a direita, criando um efeito cinematográfico',
        category: 'video',
        tabs: ['Gerar Vídeo'],
        icon: '↔️',
    },
    {
        id: 'video-dolly',
        title: 'Dolly Out',
        prompt: 'Afasta a câmara lentamente do produto, revelando o contexto ao redor',
        category: 'video',
        tabs: ['Gerar Vídeo'],
        icon: '🎥',
    },
    {
        id: 'video-parallax',
        title: 'Efeito Parallax',
        prompt: 'Cria um movimento parallax dinâmico com diferentes camadas movendo-se a velocidades diferentes',
        category: 'video',
        tabs: ['Gerar Vídeo'],
        icon: '✨',
    },

    // === E-COMMERCE ===
    {
        id: 'ecom-hero',
        title: 'Hero Image',
        prompt: 'Imagem hero impactante para página de produto, fundo clean, iluminação dramática, alta qualidade 8K',
        category: 'ecommerce',
        tabs: ['Gerar Imagem'],
        icon: '🏆',
    },
    {
        id: 'ecom-comparison',
        title: 'Antes/Depois',
        prompt: 'Composição lado a lado mostrando antes e depois do uso do produto, divisão clara e profissional',
        category: 'ecommerce',
        tabs: ['Gerar Imagem'],
        icon: '⚖️',
    },
    {
        id: 'ecom-unboxing',
        title: 'Unboxing Experience',
        prompt: 'Cena de unboxing atraente, caixa aberta com produto visível, embalagem premium, fotografia flat lay',
        category: 'ecommerce',
        tabs: ['Gerar Imagem'],
        icon: '📦',
    },
    {
        id: 'ecom-size-guide',
        title: 'Guia de Tamanhos',
        prompt: 'Visualização clara do produto com indicações de medidas e proporções, fundo neutro',
        category: 'ecommerce',
        tabs: ['Gerar Imagem'],
        icon: '📏',
    },

    // === SOCIAL MEDIA ===
    {
        id: 'social-insta-story',
        title: 'Instagram Story',
        prompt: 'Design vertical vibrante para Instagram Story, composição dinâmica, cores vibrantes, texto amigável',
        category: 'social',
        tabs: ['Gerar Imagem'],
        icon: '📲',
    },
    {
        id: 'social-tiktok',
        title: 'TikTok Thumbnail',
        prompt: 'Thumbnail chamativo para TikTok, cores saturadas, composição dinâmica, energia jovem',
        category: 'social',
        tabs: ['Gerar Imagem'],
        icon: '🎵',
    },
    {
        id: 'social-carousel',
        title: 'Carrossel Educativo',
        prompt: 'Design clean para carrossel educativo, tipografia legível, cores harmoniosas, layout minimalista',
        category: 'social',
        tabs: ['Gerar Imagem'],
        icon: '📚',
    },
    {
        id: 'social-quote',
        title: 'Quote Card',
        prompt: 'Card inspiracional com citação, tipografia elegante, fundo gradiente suave, estética moderna',
        category: 'social',
        tabs: ['Gerar Imagem'],
        icon: '💬',
    },
    {
        id: 'social-announcement',
        title: 'Anúncio de Lançamento',
        prompt: 'Design impactante para anúncio de lançamento, elementos gráficos modernos, paleta de cores ousada',
        category: 'social',
        tabs: ['Gerar Imagem'],
        icon: '🚀',
    },
];

/**
 * Get templates filtered by category
 */
export const getTemplatesByCategory = (categoryId: string): PromptTemplate[] => {
    return PROMPT_TEMPLATES.filter(template => template.category === categoryId);
};

/**
 * Get templates filtered by tab
 */
export const getTemplatesByTab = (tabName: string): PromptTemplate[] => {
    return PROMPT_TEMPLATES.filter(template => template.tabs.includes(tabName));
};

/**
 * Get template by ID
 */
export const getTemplateById = (id: string): PromptTemplate | undefined => {
    return PROMPT_TEMPLATES.find(template => template.id === id);
};
