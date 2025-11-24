// Elementos principais
const mainElement = document.querySelector("main");
const headerElement = document.querySelector("header");
const container = document.querySelector(".card-container");
const searchContainer = document.querySelector(".search-container");

// Elementos de Busca (Home e Header)
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("filtro-categoria");
const searchButton = document.getElementById("btn-busca");

// Elementos do Modal
const modal = document.getElementById("modal");
const modalCloseButton = document.getElementById("modal-close");

let data = [];

// --- FUNÇÕES DE LAYOUT ---

/**
 * Altera o layout da página para Home ou Resultados.
 * @param {boolean} showResults - 
 */
function toggleLayout(showResults) {
    if (showResults) {
        // Modo Resultados
        mainElement.classList.add("results-layout");
        mainElement.classList.remove("home-layout");
        headerElement.classList.remove("hidden-on-initial");
        // Move elementos de busca da Home para o Header
        headerElement.appendChild(searchContainer);
        searchContainer.classList.add("header-controls"); 
        categorySelect.classList.remove("hidden"); 
    } else {
        // Modo Home
        mainElement.classList.add("home-layout");
        mainElement.classList.remove("results-layout");
        headerElement.classList.add("hidden-on-initial");
        // Move elementos de busca de volta para a Main
        mainElement.insertBefore(searchContainer, container);
        searchContainer.classList.remove("header-controls");
        categorySelect.classList.add("hidden");
    }
}

// --- FUNÇÕES DE DADOS E RENDERIZAÇÃO ---

async function loadData() {
    const res = await fetch("data.json");
    data = await res.json();
    // Inicialmente, não mostramos resultados (Mostra a Home)
    render([]); 
    fillCategories();
    toggleLayout(false);
}

function render(list) {
    container.innerHTML = "";
    
    // Se a lista está vazia, mudamos para Resultados (para manter o header) e mostramos mensagem
    if (list.length > 0) {
        toggleLayout(true);
    } else if (searchInput.value.trim() !== "" || categorySelect.value !== "") {
    
        container.innerHTML = "<p style='text-align:center; margin-top:2rem; font-size:1.1rem; color:var(--muted);'>Nenhum resultado encontrado. Tente outra palavra-chave ou categoria.</p>";
        toggleLayout(true); 
    } else if (list.length === 0 && searchInput.value.trim() === "" && categorySelect.value === "") {
        toggleLayout(false);
        return;
    }

    list.forEach(item => { 
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <h3>${item.nome}</h3>
            <p>${item.descricao_curta || item.descricao.substring(0, 100) + '...'}</p>
            <span class="categoria">${item.categoria}</span>
            <div class="tags">
                </div>
            <div class="actions">
                <button class="btn secondary" onclick='openModal(${JSON.stringify(item)})'>Ver mais</button>
            </div>`;
        container.appendChild(card);
    });
}

function fillCategories() {
    const categories = [...new Set(data.map(i => i.categoria).filter(Boolean))];
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });
}

// Listener para o botão de busca
searchButton.addEventListener("click", filter);

// Listener para a tecla Enter no campo de busca
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        filter();
    }
});

categorySelect.addEventListener("change", () => {
    // 1. Limpa o campo de busca de texto
    searchInput.value = ""; 
    // 2. Chama a função de filtro
    filter();
});


/*
 Função de filtragem principal: combina busca de texto (nome, descrição, tags)
 com o filtro de categoria.
 */
function filter() {
    const term = searchInput.value.toLowerCase().trim();
    const cat = categorySelect.value;
    
 
    if (term === "" && cat === "") {
        // Mostra todos os itens
        render(data);
        return;
    }

    const f = data.filter(i => {
        // 1. Verifica a busca de texto (term)
        let textMatch = false;
        if (term) {
            const nomeMatch = i.nome && i.nome.toLowerCase().includes(term);
            const descMatch = (i.descricao_curta && i.descricao_curta.toLowerCase().includes(term)) || (i.descricao && i.descricao.toLowerCase().includes(term));
            const tagsMatch = i.tags && i.tags.some(tag => tag.toLowerCase().includes(term));

            textMatch = nomeMatch || descMatch || tagsMatch;
        } else {
            // Se o campo de texto está vazio, a busca de texto é sempre TRUE
            textMatch = true;
        }

        // 2. Verifica a busca de categoria (cat)
        const categoryMatch = cat === "" || i.categoria === cat;
        
        // Retorna TRUE apenas se AMBOS os critérios (texto e categoria) forem atendidos
        return textMatch && categoryMatch;
    });
    
    // Se a categoria for selecionada (e o campo de busca foi limpo), o usuário espera ver os resultados.
    render(f);
}

// --- FUNÇÕES DO MODAL ---

function openModal(item) {
    document.getElementById('modal-img').src = item.imagem || 'https://via.placeholder.com/400x200?text=Sem+Imagem';
    document.getElementById('modal-img').alt = item.nome;
    document.getElementById('modal-title').textContent = item.nome;
    document.getElementById('modal-categoria').textContent = `Categoria: ${item.categoria}`;
    document.getElementById('modal-desc').textContent = item.descricao;
    
    const saibaMaisEl = document.getElementById('modal-fonte-oficial');
    const videoRelacionadoEl = document.getElementById('modal-video-tutorial');
    
    saibaMaisEl.innerHTML = item.saiba_mais ? `<a href="${item.saiba_mais}" target="_blank">🔗 Saiba Mais</a>` : '';
    videoRelacionadoEl.innerHTML = item.video_relacionado ? `<a href="${item.video_relacionado}" target="_blank">▶️ Vídeo Relacionado</a>` : '';


    const num = item.numero_recomendado || '192'; 
    const callLink = document.getElementById('btn-call');
    callLink.href = `tel:${num}`;
    document.getElementById('numero-ligar').textContent = num;

    // Atualiza o botão de cópia
    document.getElementById('btn-copy').onclick = () => copyNumber(num);
    
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

function copyNumber(num) {
    navigator.clipboard.writeText(num);
    const copyBtn = document.getElementById('btn-copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => { copyBtn.textContent = originalText; }, 1500);
}

// Listener para fechar o modal
modalCloseButton.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target.id === "modal") {
        closeModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Inicializa a aplicação
loadData();