let choices = document.querySelectorAll(".choices span");


let rightAnswers = 0;
let wrongAnswers = 0;

let currentQuestion = 1;

let lang = "";
let quizStarted = false;
// We choose a language to start the quiz with
document.addEventListener("click", (e) => {
    choices.forEach((choice) => {
        if(choice.contains(e.target)) {
            lang = e.target.dataset.lang;
            startQuiz(e.target.dataset.lang);
        }
    });
});

// We get the data from jsons folder then send it to build function
async function startQuiz(language) {
    if(!quizStarted) {
        document.body.innerHTML = "";
        showSign();
        setTimeout( async() => {
            quizStarted = true;
            document.body.innerHTML = "";
            const response = await fetch(`jsons/${language}.json`);
            const data = await response.json();
            if(currentQuestion > data.length) {
                showResult();
                return;
            }
            buildQuestions(data);
        }, 1000);
    } else {
        const response = await fetch(`jsons/${language}.json`);
        const data = await response.json();
        if(currentQuestion > data.length) {
            showResult();
            return;
        }
        buildQuestions(data);
    }
};

// Building the main layout
function buildQuestions(data) {

    document.body.innerHTML = "";
    
    // Create the main container
    let container = document.createElement("div");
    container.className = "container";
    
    // Create wrong,right and timeout signs
    let right = document.createElement("div");
    right.className = "right";
    right.textContent = "Right Answer";
    let wrong = document.createElement("div");
    wrong.className = "wrong";
    wrong.textContent = "Wrong Answer!"
    let timeout = document.createElement("div");
    timeout.className = "time-out";
    timeout.textContent = "Time Out!";

    // Create question container
    let question = document.createElement("div");
    question.className = "question";
    question.appendChild(document.createTextNode(data[currentQuestion - 1].question));

    // Create answers container
    let answersContainer = document.createElement("div");
    answersContainer.className = "answers";

    // Create answers
    for(let i = 0; i < data[currentQuestion - 1].allAnswers.length; i++) {
        let span = document.createElement("span");
        span.textContent = data[currentQuestion - 1].allAnswers[i];
        answersContainer.appendChild(span);
    }

    // Create footer 
    let footer = document.createElement("footer");

    // Create the current quesion counter
    let currentQuestionCounter = document.createElement("div");
    currentQuestionCounter.className = "current-question"
    let counter = document.createTextNode(`${currentQuestion} of ${data.length}`);
    currentQuestionCounter.appendChild(counter)

    // Create dots container
    let dots = document.createElement("div");
    dots.className = "dots";

    // Create the dots
    for(let i = 0; i < data.length; i++) {
        let dot = document.createElement("span");
        if(i + 1 <= currentQuestion) {
            dot.className = "active";
        }
        dots.appendChild(dot);
    }

    // Create timer
    let timer = document.createElement("div");
    timer.className = "timer";
    timer.textContent = 10; 

    footer.appendChild(currentQuestionCounter);
    footer.appendChild(dots);
    footer.appendChild(timer);



    container.appendChild(right);
    container.appendChild(wrong);
    container.appendChild(timeout);
    container.appendChild(question);
    container.appendChild(answersContainer);
    container.appendChild(footer);

    document.body.appendChild(container);

    startCurrentQuiz(data);
}

// Tracking timer and wrong and right answers
function startCurrentQuiz(data) {

    // First we start the timer
    let timer = document.querySelector(".timer");
    let timeout = document.querySelector(".time-out");
    let timing = setInterval(() => {
        timer.textContent--;
        if(timer.textContent == 0) {
            handleDisplay(timeout);
            clearInterval(timing);
        }
    }, 1000);

    // Check answer
    let answers = document.querySelectorAll(".answers span");
    let wrong = document.querySelector(".wrong");
    let right = document.querySelector(".right");
    document.addEventListener("click", (e) => {
        answers.forEach((answer) => {
            if(answer.contains(e.target)) {
                clearInterval(timing);

                if(answer.textContent == data[currentQuestion - 1].rightAnswer) {
                    handleDisplay(right);
                } else {
                    handleDisplay(wrong);
                }
            }
        })
    });
}

// To handle displaying
function handleDisplay(sign) {
    let container = document.querySelector(".container");

    document.body.style.pointerEvents = "none"; 
    container.classList.add("disabled");
    sign.style.display = "block";
    
    setTimeout(() => {
        container.classList.remove("disabled");
        document.body.style.pointerEvents = "auto"; 
        sign.style.display = "none";

        if(sign.className == "right") {
            rightAnswers++;
        } else {
            wrongAnswers++;
        }
        currentQuestion++;
        startQuiz(lang);
    }, 1000);
};

// Show result function 
function showResult() {
    let container = document.querySelector(".container");
    container.innerHTML = "";
    
    container.classList.add("result");

    // Create The Result elements
    let resultTitle = document.createElement("div");
    resultTitle.className = "result";
    resultTitle.textContent = "The Results";

    let results = document.createElement("div");
    results.className = "results";

    let rightOnes = document.createElement("div");
    rightOnes.className = "right-answers";
    rightOnes.textContent = `You Got ${rightAnswers} Right Answers`;

    let wrongOnes = document.createElement("div");
    wrongOnes.className = "wrong-answers";
    wrongOnes.textContent = `You Got ${wrongAnswers} Wrong Answers`;

    results.appendChild(rightOnes);
    results.appendChild(wrongOnes);

    let otherOptions = document.createElement("div");
    otherOptions.className = "other-options";


    let againButton = document.createElement("div");
    againButton.className = "again";
    againButton.textContent = "Try Again";

    let newLangButton = document.createElement("div");
    newLangButton.className = "new-lang";
    newLangButton.textContent = "Try New Language";

    let closeWindowButton = document.createElement("div");
    closeWindowButton.className = "close";
    closeWindowButton.textContent = "Close App";

    otherOptions.appendChild(againButton);
    otherOptions.appendChild(newLangButton);
    otherOptions.appendChild(closeWindowButton);

    container.appendChild(resultTitle);
    container.appendChild(results);
    container.appendChild(otherOptions);
    

    checkButtons();
}

function checkButtons() {
    
    let options = document.querySelectorAll(".other-options > div");

    document.addEventListener("click", (e) => {
        options.forEach((opotion) => {
            if(opotion.contains(e.target)) {
                clickButton(opotion);
            }
        })
    })
};

function clickButton(button) {
    let container = document.querySelector(".container");
    currentQuestion = 1;
    wrongAnswers = 0;
    rightAnswers = 0;
    if(button.classList.contains("again")) {
        quizStarted = false;
        startQuiz(lang);
    } else if(button.classList.contains("new-lang")) {
        quizStarted = false;
        window.location.reload();
    } else {
        container.innerHTML = "";
        container.appendChild(document.createTextNode("Thanks For Trying Out The App"));
        container.style.cssText = "text-align: center";
    }
};

// Show A Sign Before Starting The Quiz
function showSign() {
    let sign = document.createElement("div");
    sign.className = "sign";
    document.body.appendChild(sign);
};