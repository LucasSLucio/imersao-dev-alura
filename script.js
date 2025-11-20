let cardContainer = document.querySelector(".card-container");
let dados = [];

// Carrega o JSON apenas 1 vez
async function iniciarBusca() {
    if (dados.length === 0) {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
    }

    realizarBusca();
}

function realizarBusca() {
    let termo = document.querySelector("input").value.toLowerCase().trim();
    // Define o comprimento mínimo necessário para buscar
    const COMPRIMENTO_MINIMO = 3; 

    // sempre limpa antes
    cardContainer.innerHTML = "";

    // 1. Se o campo estiver vazio, não mostra nada
    if (termo === "") {
        cardContainer.innerHTML = "<p style='padding:1rem;'>Digite algo para buscar.</p>";
        return;
    }

    // 2. NOVA REGRA: Verifica o comprimento do termo
    if (termo.length < COMPRIMENTO_MINIMO) {
        cardContainer.innerHTML = `<p style='padding:1rem;'>O termo de busca deve ter pelo menos ${COMPRIMENTO_MINIMO} caracteres.</p>`;
        return;
    }

    // TENTA ENCONTRAR CORRESPONDÊNCIA EXATA NO NOME PRIMEIRO
    let filtradosExatos = dados.filter(dado => 
        dado.nome.toLowerCase() === termo
    );

    let filtrados;

    if (filtradosExatos.length > 0) {
       
        filtrados = filtradosExatos;
    } else {
        
        filtrados = dados.filter(dado =>
            dado.nome.toLowerCase().includes(termo) ||
            dado.descricao.toLowerCase().includes(termo) ||
            String(dado.ano).includes(termo)
        );
    }
    
    // --- FIM DA LÓGICA DE FILTRO ---

    if (filtrados.length === 0) {
        cardContainer.innerHTML = "<p style='padding:1rem;'>Nenhum resultado encontrado.</p>";
        return;
    }

    renderizarCards(filtrados);
}

function renderizarCards(lista) {
    for (let dado of lista) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.ano}</p>
        <p>${dado.descricao}</p>
        <p><a href="${dado.link}" target="_blank">Leia mais</a></p>
        `;
        cardContainer.appendChild(article);
    }
}