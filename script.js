// SCRIPT SCREEN LOBBY
const MAINURL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"

function getAllQuizzes(){
    let quizzes = axios.get(MAINURL)
    quizzes.then(showQuizzes)
}
getAllQuizzes()

function showQuizzes(quizzes){
    let homeHTML = document.querySelector(".home");
    let data = quizzes.data;
    homeHTML.innerHTML += `<div class="create">
                                <div class="create-quizz">
                                    <p>Você não criou nenhum quizz ainda :(</p> 
                                        <button>Criar Quizz</button>   
                                </div>
                            </div>
                            <div class="section-title"> 
                                <p>Todos os Quizzes</p> 
                            </div> 
                            <div class="quizzes"></div>`
    let quizzSpace = document.querySelector(".quizzes")
    for(let i = 0; i < data.length; i++){
        quizzSpace.innerHTML += `<div class="quizz" onclick="callSelectedQuizz(${data[i].id})">
                                        <img src="${data[i].image}">
                                        <p>${data[i].title}</p>
                                    </div>`
                                    console.log(data[i].id)
    }
}

// SCRIPT SCREEN IN QUIZZ

function callSelectedQuizz(identifierQuizz) {
    const hideHome = document.querySelector('.home');
    const quezzScreen = document.querySelector('.quezz-screen');
    hideHome.classList.add('hide-me');
    quezzScreen.classList.remove('hide-me');
    
    const quizz = axios.get(`${MAINURL}/${identifierQuizz}`);
    quizz.then(startQuizz);
}

function startQuizz(resposta){
    console.log(resposta.data.image);
    let quezzScreenHTML = document.querySelector('.quezz-screen');
    quezzScreenHTML.innerHTML = `<figure class="quezz-indicator"> 
                                    <img src="${resposta.data.image}">
                                    <figcaption>
                                        <p>${resposta.data.title}</p>
                                    </figcaption>
                                </figure>

                                <section class="questions-space">
                                </section>

                                <section class="quezz-result">
                                    <div class="title-quezz-result">
                                        <p></p>
                                    </div>
                                    <div>
                                        <img src="">
                                        <span></span>
                                    </div>
                                </section>

                                <footer class="footer-quezz-screen">
                                    <button class="button-restart-quizz">
                                        Reiniciar Quezz
                                    </button>
                                    <button class="button-back-to-home">
                                        voltar pra home
                                    </button>
                                </footer>`
    
    for(let i = 0; i < resposta.data.questions.length; i++){
        let arrayQuestionsSpaceHTML = [];
        let questionsSpaceHTML = document.querySelector('.questions-space');
        questionsSpaceHTML.innerHTML +=   `<article class="question">
                                                <div class="title-question">
                                                    <p>${resposta.data.questions[i].title}</p>
                                                </div>
                                                <div class="options-space">
                                                    <div class="option">
                                                        imagem da opcao
                                                        <span>legenda da foto</span>
                                                    </div>
                                                    <div class="option">
                                                        imagem da opcao
                                                        <span>legenda da foto</span>
                                                    </div>
                                                    <div class="option">
                                                        imagem da opcao
                                                        <span>legenda da foto</span>
                                                    </div>
                                                    <div class="option">
                                                        imagem da opcao
                                                        <span>legenda da foto</span>
                                                    </div>
                                                </div>
                                            </article>`
                                            console.log(resposta.data.questions[i]);
    }
}