
const mainContainer = document.querySelector(".maincontainer");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timeStatus = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");


// Quiz State variables :
const QUIZ_TIME_LIMIT = 10;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let numberOfQuestion = 5;
let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerCount = 0;


// Display Quiz result and hide the Quiz container:
const showQuizResult = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const resultText = `You answered <strong>${correctAnswerCount}</strong> out of <strong>
            ${numberOfQuestion} </strong> questions correctly.  Great effort!</p>`;
    document.querySelector(".result-message").innerHTML = resultText;

}

// for reset the timer :
const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timeStatus.textContent = `${currentTime}s`;
}

// Initialize the start time for the quiz:
const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timeStatus.textContent = `${currentTime}s`;

        if (currentTime <= 0) {
            clearInterval(timer);
            HighlightCorrectAnswer();
            nextQuestionBtn.style.visibility = "visible";
            quizContainer.querySelector(".quiz-timer").style.background = "red";

            // Disable all answer options after one selected :
            answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
        }
    }, 1000);
}

// Fetch the random questions based on selected category :
const getRandomQuestion = () => {
    const categoryQuestions = questionBank.find(
        cat => cat.category.toLowerCase() === quizCategory.toLowerCase()
    )?.questions || [];

    //   show result if all question have been used:
    if (questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestion)) {
        return showQuizResult();
    }


    // Filter out already asked question and choose a random one :
    const availableQuestion = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = availableQuestion[Math.floor(Math.random() * categoryQuestions.length)];

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
};

// Highlight the correct answer selection and add icons :
const HighlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-rounded"> check_circle'</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);

}

// Handle the user's answer:
const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);

    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');
    !isCorrect ? HighlightCorrectAnswer() : correctAnswerCount++;

    // Insert icons based on correctness:
    const iconHTML = `<span class="material-symbols-rounded"> ${isCorrect ? 'check_circle' : 'cancel'} </span> `;
    option.insertAdjacentHTML("beforeend", iconHTML);

    // Disable all answer options after one selected :
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");

    nextQuestionBtn.style.visibility = "visible";
}

// Render the current question and its options in the quiz:
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;
    console.log(currentQuestion);
    resetTimer();
    startTimer();

    //   for UI updation:
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    quizContainer.querySelector(".quiz-timer").style.background = "rgb(90, 3, 90)";
    const questionElement = document.querySelector(".quiz-question");
    questionStatus.innerHTML = `<strong>${questionIndexHistory.length} </strong>of <strong>${numberOfQuestion}</strong> Questions`;

    if (questionElement) {
        questionElement.textContent = currentQuestion.question;

        // Create option <li> element and append them and add click event listeners:
        currentQuestion.options.forEach((Option, index) => {
            const li = document.createElement("li");
            li.classList.add("answer-option");
            li.textContent = Option;
            answerOptions.appendChild(li);
            li.addEventListener("click", () => handleAnswer(li, index));
        });
    }

};

// Start the quiz and render random question:
const startQuiz = () => {
    mainContainer.style.display = "none";
    quizContainer.style.display = "block";

    // Update the quiz category and no. of question:
    quizCategory = mainContainer.querySelector(".category-option.active").textContent;
    numberOfQuestion = parseInt(mainContainer.querySelector(".question-option.active").textContent);

    renderQuestion();
}

// Highlight the selected option on click - category or no. of question:
document.querySelectorAll(".category-option , .question-option").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

// for  Re-Start the quiz and return mainContainer:
const resetQuiz = () => {
    resetTimer();
    correctAnswerCount = 0;
    questionIndexHistory.length = 0;
    mainContainer.style.display = "block";
    resultContainer.style.display = "none";
}

renderQuestion();

nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quize-btn").addEventListener("click", startQuiz);




