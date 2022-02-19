function comparador() { 
	return Math.random() - 0.5;
}
let porcentagemDeAcertos;

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
                                    // console.log(data[i].id)
    }
}

// SCRIPT SCREEN IN QUIZZ
let arrayDeRespostasPossiveis = [];
let identificadorDoQuizz;
function callSelectedQuizz(identifierQuizz) {
    const HIDEHOME = document.querySelector('.home');
    const QUEZZSCREEN = document.querySelector('.quezz-screen');
    const quizz = axios.get(`${MAINURL}/${identifierQuizz}`);
    identificadorDoQuizz = identifierQuizz;
    HIDEHOME.classList.add('hide-me');
    QUEZZSCREEN.classList.remove('hide-me');
    quizz.then(startQuizz);
}

function startQuizz(resposta){
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
    colocarQuestions(resposta);                                 
    }

function colocarQuestions(resposta) {

    for(let i = 0; i < resposta.data.questions.length; i++){
        let opcoesDeResposta = resposta.data.questions[i].answers;
        let questionsSpaceHTML = document.querySelector('.questions-space');
        questionsSpaceHTML.innerHTML +=   `<article class="question q${i}">
                                                <div class="title-question">
                                                    <p>${resposta.data.questions[i].title}</p>
                                                </div>
                                                <div class="options-space">
                                                </div>
                                            </article>`
        colocarOpcoesDeResposta(opcoesDeResposta,i);
    }
}

function colocarOpcoesDeResposta(opcoesDeResposta,i){
    opcoesDeResposta.sort(comparador);
    arrayDeRespostasPossiveis.push(opcoesDeResposta)
    let optionsSpace = document.querySelector(`.q${i} .options-space`);
    for(let c = 0; c < opcoesDeResposta.length; c++){
        optionsSpace.innerHTML += `<div class="option opt${c}" onclick="selectOption(${i}, ${c})">
                                        <img src="${opcoesDeResposta[c].image}">
                                        <p>${opcoesDeResposta[c].text}</p>
                                        <span class="${opcoesDeResposta[c].isCorrectAnswer} hide-me"></span>
                                    </div>`
    }
}

function selectOption(questaoDaOpcao,opcaoSelecionada){
    let a = document.querySelector(`.q${questaoDaOpcao} .opt${opcaoSelecionada}`);
    a.classList.add('selecionada');
    for(let cont = 0; cont < document.querySelectorAll(`.q${questaoDaOpcao} .option`).length; cont++){
        let b = document.querySelector(`.q${questaoDaOpcao} .opt${cont}`);
        let c = document.querySelector(`.q${questaoDaOpcao} .opt${cont}`);
        c.setAttribute('onclick', '');
        if(document.querySelector(`.q${questaoDaOpcao} .opt${cont}`) != a){
            b.classList.add('opcao-nao-selecionada');
        }
        if(!document.querySelector(`.q${questaoDaOpcao} .opt${cont} .true`)){
            b.classList.add('false');
        }
        else{
            b.classList.add('true');
        }
    }
    if(document.querySelector(`.q${questaoDaOpcao + 1}`)){
        setTimeout(function(){
            document.querySelector(`.q${questaoDaOpcao + 1}`).scrollIntoView({block: "center"});},500);
    }
    else{
        calcularAcertos();
    }
}

function calcularAcertos(){
    let a = document.querySelectorAll('.question').length
    let b = document.querySelectorAll('.selecionada .true').length
    porcentagemDeAcertos = parseInt(b*100)/a;
    rechamandoOQuizz();
}

function rechamandoOQuizz(){
    const quizz = axios.get(`${MAINURL}/${identificadorDoQuizz}`);
    quizz.then(mostrarLeveis);
}

//iniciando a tela de resultado. Parei aqui
function mostrarLeveis(resposta){
    console.log(resposta.data.levels)
}