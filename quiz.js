document.addEventListener("DOMContentLoaded", function () {
    const questions = [
        {
            question: "What is your skin type?",
            options: ["Oily", "Dry", "Combination", "Sensitive"]
        },
        {
            question: "What’s your main skincare goal?",
            options: ["Acne control", "Anti-aging", "Hydration", "Glow"]
        },
        {
            question: "What kind of makeup do you prefer?",
            options: ["Natural", "Glam", "Minimal", "Bold"]
        },
        {
            question: "Which beauty product do you use the most?",
            options: ["Lipstick", "Foundation", "Moisturizer", "Serum"]
        }
    ];

    let userAnswers = [];
    let currentQuestionIndex = 0;

    const questionText = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");
    const resultSection = document.getElementById("result-section");
    const quizSection = document.getElementById("quiz-section");
    const recommendationText = document.getElementById("recommendation");
    const restartButton = document.getElementById("restart-btn");

    function loadQuestion(index) {
        const currentQuestion = questions[index];
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = "";

        currentQuestion.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.onclick = function () {
                document.querySelectorAll("#options button").forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
                userAnswers[index] = option;
                nextButton.disabled = false;
            };
            optionsContainer.appendChild(button);
        });

        nextButton.disabled = true;
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion(currentQuestionIndex);
        } else {
            generateRecommendation();
        }
    });

    function generateRecommendation() {
        quizSection.style.display = "none";
        resultSection.style.display = "block";

        const [skinType, goal, makeup, product] = userAnswers;
        let recommendation = "Based on your answers, we recommend: ";

        if (skinType === "Oily" && goal === "Acne control") {
            recommendation += "a gentle oil-free cleanser and salicylic acid serum.";
        } else if (skinType === "Dry" && goal === "Hydration") {
            recommendation += "a hydrating moisturizer with hyaluronic acid.";
        } else if (makeup === "Natural") {
            recommendation += "a light BB cream and lip balm.";
        } else {
            recommendation += "a bold lipstick and volumizing mascara.";
        }

        recommendationText.textContent = recommendation;
    }

    restartButton.addEventListener("click", function () {
        currentQuestionIndex = 0;
        userAnswers = [];
        quizSection.style.display = "block";
        resultSection.style.display = "none";
        loadQuestion(currentQuestionIndex);
    });

    loadQuestion(currentQuestionIndex);
});
