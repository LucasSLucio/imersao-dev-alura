const cardContainer = document.querySelector("main"); // Seleciona o elemento <main> para colocar os cards.
const campoBusca = document.querySelector("div input"); // Seleciona o campo de input da busca.
const botaoBusca = document.querySelector("#botao-busca"); // Seleciona o botão de busca.
let dados = []; // Array que vai armazenar os dados do data.json.

// Função assíncrona para carregar os dados iniciais do arquivo JSON.
async function iniciarBusca() {
    // O bloco try...catch lida com possíveis erros ao buscar o arquivo.
    try {
        const resposta = await fetch("data.json"); // Faz a requisição para o arquivo data.json.
        dados = await resposta.json(); // Converte a resposta para JSON e armazena na variável 'dados'.
        renderizarCards(dados); // Chama a função para exibir todos os cards na tela inicialmente.
    } catch (error) {
        console.error("Erro ao buscar os dados:", error); // Exibe um erro no console se a busca falhar.
    }
}

// Função que filtra e exibe os cards com base no termo pesquisado.
function buscar() {
    // Pega o valor do campo de busca e converte para minúsculas para uma busca não sensível a maiúsculas/minúsculas.
    const termoBusca = campoBusca.value.toLowerCase(); 
    // Filtra o array 'dados', mantendo apenas os itens cujo nome ou descrição incluem o termo de busca.
    const resultados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca)
    );
    renderizarCards(resultados); // Renderiza os cards com os resultados do filtro.
}

// Função que renderiza (cria e exibe) os cards na tela.
function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar os novos.
    // Itera sobre cada item do array de dados recebido.
    for (const dado of dados) {
        const article = document.createElement("article"); // Cria um novo elemento <article>.
        // Define o conteúdo HTML do card com os dados do item atual.
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p><strong>Ano de criação:</strong> ${dado.ano}</p>
        <p>${dado.descricao}</p>
        <p><a href="${dado.link}" target="_blank">Leia mais</a></p>
        `;
        cardContainer.appendChild(article); // Adiciona o novo card ao container principal.
    }
}

// Adiciona um "ouvinte de evento" ao botão de busca. A função 'buscar' será chamada toda vez que o botão for clicado.
botaoBusca.addEventListener("click", buscar); 

// Chama a função inicial para carregar os dados e exibir os cards quando a página é carregada.
iniciarBusca(); 