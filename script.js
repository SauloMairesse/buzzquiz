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
    section1.innerHTML += `<div class="create"><div class="create-quizz"> <p>Você não criou nenhum quizz ainda :(</p> <button>Criar Quizz</button> </div></div> <div class="section-title"> <p>Todos os Quizzes</p> </div> <div class="quizzes"></div>`
    let quizzSpace = document.querySelector(".quizzes")
    for(let i = 0; i < data.length; i++){
        quizzSpace.innerHTML += `<div class="quizz"> <img src="${data[i].image}"> <p>${data[i].title}</p> </div>`
    }
}
// SCRIPT SCREEN IN QUIZZ
