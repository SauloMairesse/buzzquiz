function comparador() { 
	return Math.random() - 0.5;
}
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
                                        <button onclick="showCreationScreen()">Criar Quizz</button>   
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
let porcentagemDeAcertos;
let meuLevel;

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
                                </section>`
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
    if(document.querySelectorAll('.selecionada').length == document.querySelectorAll('.question').length){   
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
    quizz.then(mostrarLevels);
}

function mostrarLevels(resposta){
    console.log(resposta.data.levels);
    let arrayDeLevels = [];
    let quezzResultHTML = document.querySelector('.quezz-result');
    
    //ordemCrescente
    for(let count = 0; count < resposta.data.levels.length; count++){
        arrayDeLevels.push(resposta.data.levels[count].minValue)
        arrayDeLevels.sort();
    }
    //pegarOLevel
    for(let count = 0; count < arrayDeLevels.length; count++){
        if(porcentagemDeAcertos >= arrayDeLevels[count]){
            if(!arrayDeLevels[count+1]){
                meuLevel = arrayDeLevels[count]
            }
        }
        else{
            meuLevel = arrayDeLevels[count - 1];
            count = arrayDeLevels.length;
        }
    }
    //printarOlevel 
    for(let i = 0; i < resposta.data.levels.length; i++){
        if(meuLevel == resposta.data.levels[i].minValue){
            console.log('entrei aqui')
            quezzResultHTML.innerHTML +=`<div class="title-quezz-result">
                                            <p>${resposta.data.levels[i].title}</p>
                                        </div>          
                                        <img src="${resposta.data.levels[i].image}">
                                        <p class="legenda">${resposta.data.levels[i].text}</p><br>` 
        }
    }
    let quezzScreenHTML = document.querySelector('.quezz-screen');
    quezzScreenHTML.innerHTML +=`<footer class="footer-quezz-screen">
                                    <button class="button-restart-quizz" onclick="reiniciarQuizz()">
                                        Reiniciar Quezz
                                    </button>
                                    <button class="button-back-to-home" onclick="voltarPraHome()">
                                        voltar pra home
                                    </button>
                                </footer>`
    setTimeout(function(){
        document.querySelector('footer').scrollIntoView({block: "center"});},500)
}

function reiniciarQuizz(){
    arrayDeRespostasPossiveis.length = 0;
    porcentagemDeAcertos = "";
    meuLevel = "";
    let a = document.querySelector('.quezz-screen')
    a.innerHTML = " ";
    callSelectedQuizz(identificadorDoQuizz);
}

function voltarPraHome(){
    window.scrollTo(0,0);
    window.location.reload();
}

// SCRIPT SCREEN QUIZZ CREATION
let numberOfLevels = 0
let numberOfQuestions = 0

function showCreationScreen(){
    document.querySelector(".home").style.display = "none"
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