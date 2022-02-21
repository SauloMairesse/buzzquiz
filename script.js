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
            quezzResultHTML.innerHTML +=`<div class="title-quezz-result">
                                            <h1>${resposta.data.levels[i].title}</h1>
                                        </div>
                                        <div class = img-legenda-results>          
                                            <img src="${resposta.data.levels[i].image}">
                                            <p class="legenda">${resposta.data.levels[i].text}</p><br>
                                        </div>` 
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
    checkFormInitial()
}

function showLevelCreationScreen(){
    checkQuestions()
}

function showFinalScreen(){
    checkLevels()
}

function CreateQuizz(){
    document.querySelector(".form-initial").innerHTML = `<br>
        <input type="text" class="form-input text required" minlength="20" maxlength="65" placeholder="Título do seu quizz" required>
        <input type="url" class="form-input url required" placeholder="URL da imagem do seu quizz" required>
        <input type="number" min="3" class="form-input required" placeholder="Quantidade de perguntas do quizz" required>
        <input type="number" min="2" class="form-input required" placeholder="Quantidade de níveis do quizz" required>`
    document.querySelector(".quizz-creation").innerHTML += `<div class="button-creation">
    <button onclick="showQuestionsCreationScreen()" class="initial-button">Prosseguir pra criar perguntas</button>
</div>`
}

function questionCreation(){
    let questions = document.querySelector(".questions-space")
    let creation = document.querySelector(".question-creation")
    for(let i = 1; i <= numberOfQuestions;i++){
        questions.innerHTML += 
            `<br>
            <div class="question${i} forms">
                <div class="subtitle">
                    <h1>Pergunta ${i}</h1>
                </div>
                <input type="text" minlength="20" class="form-input input0 required" placeholder="Texto da pergunta" required>
                <input type="text" class="form-input input1 required" placeholder="Cor de fundo da pergunta" required>
                <div class="subtitle">
                    <h1>Resposta correta</h1>
                </div>
                <input type="text" class="form-input input2 required" placeholder="Resposta correta" required>
                <input type="url" class="form-input input3 required" placeholder="URL da imagem" required>
                <div class="subtitle">
                    <h1>Resposta incorreta</h1>
                </div>
                <input type="text" class="form-input input4 required" placeholder="Resposta incorreta 1" required>
                <input type="url" class="form-input input5 required" placeholder="URL da imagem" required>
                <br>
                <input type="text" class="form-input input6 nrequired" placeholder="Resposta incorreta 2">
                <input type="url" class="form-input input7 nrequired" placeholder="URL da imagem">
                <br>
                <input type="text" class="form-input input8 nrequired"  placeholder="Resposta incorreta 3">
                <input type="url" class="form-input input9 nrequired"  placeholder="URL da imagem">
            </div>`
    }
    creation.innerHTML += '<div class="button-creation"><button onclick="showLevelCreationScreen()" class="initial-button">Prosseguir pra criar níveis</button></div>'
}

function levelCreation(){
    let levels = document.querySelector(".level-creation")
    let level = document.querySelector(".levels-space")
    for(let i = 1; i <= numberOfLevels;i++){
        level.innerHTML += `<br>
            <div class="level${i} forms">
                <div class="subtitle">
                    <h1>Nível ${i}</h1>
                </div>
                <input class="form-input input0 required" minlength="10" type="text" placeholder="Título do nível">
                <input class="form-input input1 required" min="0" max="100" type="number" placeholder="% de acerto mínima">
                <input class="form-input input2 required" type="url" placeholder="URL da imagem do nível">
                <input class="form-input input3 required" minlength="30" type="text" placeholder="Descrição do nível">
            </div>`
        }
    levels.innerHTML += `<div class="button-creation">
    <button onclick="showFinalScreen()" class="initial-button">Finalizar Quizz</button>
    </div>`
}

function questionsNumber(){
    let formInitial = document.querySelector(".form-initial")
    let startInputs = formInitial.querySelectorAll("input")
    for(let i = 0; i < startInputs.length;i++){
        startAnswers.push(startInputs[i].value)
    }
    numberOfQuestions = startAnswers[2]
    numberOfLevels = startAnswers[3]
}

function checkFormInitial(){
    let form = document.querySelector(".form-initial")
    let inputs = form.querySelectorAll(".required")
    let len = inputs.length
    let valid = true
    for(let i=0; i < len; i++){
        if (!inputs[i].value){ 
            valid = false
        }
    }
    if(inputs[0].value.length < 20){
        valid = false
    }
    if (inputs[1].type === "url" && !isValidHttpUrl(inputs[1].value)) {
        valid = false
    }
    if(parseInt(inputs[2].value) < 3){
        valid = false
    }
    if(parseInt(inputs[3].value) < 2){
        valid = false
    }
    if(!valid){
        alert('Por favor preencha todos os campos.')
        valid = true
    } 
    else {
        questionsNumber()
        document.querySelector(".quizz-creation").style.display = "none"
        document.querySelector(".question-creation").style.display = "block"
        questionCreation()
    }
}

let id

function checkQuestions(){
    let valid = true
    for(let i = 1; i <= numberOfQuestions;i++){
        let questionForm = document.querySelector(`.question${i}`)
        let required = questionForm.querySelectorAll(".required")
        let ninputs = questionForm.querySelectorAll(".nrequired")
        for(let j = 0; j < required.length;j++){
            if(!required[j].value){ 
                valid = false
            }
            else if (required[j].type === "url" && !isValidHttpUrl(required[j].value)){
                valid = false
            }
            else if (required[0].value.length < 20){
                valid = false
            }
        }
        for(let k = 0; k < ninputs.length;k += 2){
            if(!ninputs[k].value && ninputs[k+1].value){
                valid = false
            }
            else if(ninputs[k].value && !ninputs[k+1].value){
                valid = false
            }
            else if(ninputs[k+1].type === "url" && !isValidHttpUrl(ninputs[k+1].value) && ninputs[k].value && ninputs[k+1].value){
                valid = false
            }
        }
        if(!isHex(required[1].value)){
            valid = false
        }
    }
    if(!valid){
        alert("faz direito")
        valid = true
    }
    else{
        document.querySelector(".question-creation").style.display = "none"
        document.querySelector(".level-creation").style.display = "block"
        levelCreation()
    }
}

function checkLevels(){
    let valid = true
    let zeroPorcent = []
    for(let i = 1; i <= numberOfLevels;i++){
        let levelForm = document.querySelector(`.level${i}`)
        let required = levelForm.querySelectorAll(".required")
        for(let j = 0; j < required.length;j++){
            if(!required[j].value){
                valid = false
                alert("aaaa")
            }
            else if (required[0].value.length < 20){
                valid = false
                alert("bbbb")
            }
            else if (required[1].value.length > 100 && required[1].value.length < 0){
                valid = false
                alert("cccc")
            }
            else if (required[3].value.length < 30){
                valid = false
                alert("dddd")
            }
            else if (required[i].type === "url" && !isValidHttpUrl(required[i].value)){
                valid = false
                alert("eeee")
            }
            zeroPorcent.push(required[1].value)
        }
    }
    if(zeroPorcent.indexOf("0") === (-1)){
        valid = false
        alert("ffff")
    }
    
    if(!valid){
        alert("faz direito")
        zeroPorcent = []
        valid = true
    }
    else{
        createObject()
        document.querySelector(".level-creation").style.display = "none"
        document.querySelector(".final-creation").style.display = "block"
        finalCheck()
    }
}

function finalCheck(){
}

function isValidHttpUrl(string) {
    let url;
    try { url = new URL(string); }
    catch (_) { return false; }
    return url.protocol === "http:" || url.protocol === "https:";
}

function isHex(inputs) {
    var reg = /^#([0-9a-f]{6}){1}$/i;
    return (reg.test(inputs));
}

let startQuizzs
function createObject(){
    startQuizzs = {
        title: "",
        image: "",
        questions: [],
        levels: []
    }
    startQuizzs.title = document.querySelector(".form-initial .text").value
    startQuizzs.image = document.querySelector(".form-initial .url").value
    
    for(let i = 1; i <= numberOfQuestions;i++){
        let titleQuestion = {
            title: "",
            color: "",
            answers: []
        }
        titleQuestion.title = document.querySelector(`.questions-space .question${i} .input${0}`).value
        titleQuestion.color = document.querySelector(`.questions-space .question${i} .input${1}`).value

        for(let k = 2; k < 10;k = k + 2){
            let answersObject = {
                text: "",
                image: "",
                isCorrectAnswer: ""
            }
            answersObject.text = document.querySelector(`.questions-space .question${i} .input${k}`).value
            answersObject.image = document.querySelector(`.questions-space .question${i} .input${(k+1)}`).value
            if(k === 2){
                answersObject.isCorrectAnswer = true
            }
            else{
                answersObject.isCorrectAnswer = false
            }
            if(answersObject.text != ""){
            titleQuestion.answers.push(answersObject)
            }
        }
        startQuizzs.questions.push(titleQuestion)
    }
    for(let i = 0; i < numberOfLevels; i++){
        let levelObject = {
            title: "",
            image: "",
            text: "",
            minValue: ""
        }
        levelObject.title = document.querySelector(`.levels-space .input0`).value
        levelObject.image = document.querySelector(`.levels-space .input2`).value
        levelObject.text = document.querySelector(`.levels-space .input3`).value
        levelObject.minValue = parseInt(document.querySelector(`.levels-space .input1`).value)
        startQuizzs.levels.push(levelObject)
    }
    console.log(startQuizzs)
    axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", startQuizzs)
    .then(response => {id = response.data.id})
}