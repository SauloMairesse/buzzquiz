// SCRIPT SCREEN LOBBY
let mainUrl = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"

function getAllQuizzes(){
    let quizzes = axios.get(mainUrl)
    quizzes.then(showQuizzes)
}
getAllQuizzes()

function showQuizzes(quizzes){
    let section1 = document.querySelector(".page1")
    let data = quizzes.data;
    section1.innerHTML += `<div class="create"><div class="create-quizz"> <p>Você não criou nenhum quizz ainda :(</p> <button onclick="showCreationScreen()">Criar Quizz</button> </div></div> <div class="section-title"> <p>Todos os Quizzes</p> </div> <div class="quizzes"></div>`
    let quizzSpace = document.querySelector(".quizzes")
    for(let i = 0; i < data.length; i++){
        quizzSpace.innerHTML += `<div class="quizz"> <img src="${data[i].image}"> <p>${data[i].title}</p> </div>`
    }
}
// SCRIPT SCREEN IN QUIZZ

function callSelectedQuizz() {   
}

// SCRIPT SCREEN QUIZZ CREATION
let numberOfLevels = 0
let numberOfQuestions = 0


function showCreationScreen(){
    document.querySelector(".page1").style.display = "none"
    document.querySelector(".quizz-creation").style.display = "block"
    CreateQuizz()
}

function showQuestionsCreationScreen(){
    document.querySelector(".quizz-creation").style.display = "none"
    document.querySelector(".question-creation").style.display = "block"
    questionCreation()
}

function showLevelCreationScreen(){
    document.querySelector(".question-creation").style.display = "none"
    document.querySelector(".level-creation").style.display = "block"
    levelCreation()
}

function CreateQuizz(){
    document.querySelector(".form-initial").innerHTML = `<br>
    <input type="text" placeholder="Título do seu quizz">
    <input type="text" placeholder="URL da imagem do seu quizz">
    <input type="text" placeholder="Quantidade de perguntas do quizz">
    <input type="text" placeholder="Quantidade de níveis do quizz">`
}

function questionCreation(){
    let questions = document.querySelector(".questions-space")
    for(let i = 1; i <= numberOfQuestions;i++){
        questions.innerHTML += 
            `<form class="form-initial">
                <br>
                <div class="subtitle">
                    <h1>Pergunta ${i}</h1>
                </div>
                <input type="text" placeholder="Texto da pergunta">
                <input type="text" placeholder="Cor de fundo da pergunta">
                <div class="subtitle">
                    <h1>Resposta correta</h1>
                </div>
                <input type="text" placeholder="Resposta correta">
                <input type="text" placeholder="URL da imagem">
                <div class="subtitle">
                    <h1>Resposta incorreta</h1>
                </div>
                <input type="text" placeholder="Resposta incorreta 1">
                <input type="text" placeholder="URL da imagem">
                <br>
                <input type="text" placeholder="Resposta incorreta 2">
                <input type="text" placeholder="URL da imagem">
                <br>
                <input type="text" placeholder="Resposta incorreta 3">
                <input type="text" placeholder="URL da imagem">
            </form>`
    }
}

function levelCreation(){
    let level = document.querySelector(".levels-space")
    for(let i = 1; i <= numberOfLevels;i++){
        level.innerHTML += `<form class="form-initial">
        <br>
        <div class="subtitle">
            <h1>Nível ${i}</h1>
        </div>
        <input type="text" placeholder="Título do nível">
        <input type="text" placeholder="% de acerto mínima">
        <input type="text" placeholder="URL da imagem do nível">
        <input type="text" placeholder="Descrição do nível">
    </form>`
    }
}

