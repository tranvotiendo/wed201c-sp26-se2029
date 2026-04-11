document.addEventListener('DOMContentLoaded', () => {
    // --- Data: 15 câu hỏi ---
    const quizData = [
        { type: 'theory', question: "Hệ số góc của tiếp tuyến của đồ thị hàm số \( y = f(x) \) tại điểm có hoành độ \( x_0 \) là gì?", options: ["f(x₀)", "f'(x₀)", "Giá trị x₀", "Tung độ y₀"], answer: 1 },
        { type: 'calculation', question: "Tìm phương trình tiếp tuyến của đồ thị hàm số \( y = x^2 + 1 \) tại điểm có hoành độ \( x_0 = 1 \).", answer: { m: 2, c: 0 } },
        { type: 'calculation', question: "Tìm phương trình tiếp tuyến của đồ thị hàm số \( y = x^3 - 3x^2 + 2 \) tại \( x_0 = 3 \).", answer: { m: 9, c: -25 } },
        { type: 'theory', question: "Thành phần 'y₀' trong công thức \( y = f'(x_0)(x - x_0) + y_0 \) là gì?", options: ["Hoành độ tiếp điểm", "Hệ số góc", "Tung độ tiếp điểm", "Đạo hàm cấp hai"], answer: 2 },
        { type: 'calculation', question: "Tìm PTTT của đồ thị hàm số \( y = \\frac{2x - 1}{x + 1} \) tại \( x_0 = 1 \).", answer: { m: 0.75, c: -0.25 } },
        { type: 'theory', question: "Nếu tiếp tuyến song song với trục Ox, hệ số góc của nó bằng bao nhiêu?", options: ["1", "Không xác định", "-1", "0"], answer: 3 },
        { type: 'calculation', question: "Tìm PTTT của đồ thị hàm số \( y = \\sqrt{x} \) tại điểm có hoành độ \( x_0 = 4 \).", answer: { m: 0.25, c: 1 } },
        { type: 'theory', question: "Để tìm tiếp điểm khi biết hệ số góc k, ta giải phương trình nào?", options: ["f(x) = k", "f'(x) = 0", "f(x) = 0", "f'(x) = k"], answer: 3 },
        { type: 'calculation', question: "Tìm PTTT của đồ thị \( y = x^2 - 2x \), biết tiếp tuyến song song với đường thẳng \( y = 4x - 1 \).", answer: { m: 4, c: -9 } },
        { type: 'calculation', question: "Tìm PTTT của đồ thị hàm số \( y = \\cos(x) \) tại điểm có hoành độ \( x_0 = \\frac{\\pi}{2} \).", answer: { m: -1, c: 1.57 } },
        { type: 'theory', question: "Công thức tổng quát nào sau đây là đúng cho PTTT?", options: ["y = f(x₀)(x - x₀) + y₀", "y = f'(x₀)(x + x₀) + y₀", "y - y₀ = f'(x₀)(x - x₀)", "y - y₀ = f(x₀)(x - x₀)"], answer: 2 },
        { type: 'calculation', question: "Tìm PTTT của đồ thị hàm số \( y = e^x \) tại điểm có hoành độ \( x_0 = 0 \).", answer: { m: 1, c: 1 } },
        { type: 'calculation', question: "Tìm PTTT của đồ thị hàm số \( y = \\ln(x) \) tại điểm có hoành độ \( x_0 = 1 \).", answer: { m: 1, c: -1 } },
        { type: 'theory', question: "Nếu tiếp tuyến vuông góc với đường thẳng \( y = ax + b \) (với a ≠ 0), hệ số góc của nó là:", options: ["a", "-a", "1/a", "-1/a"], answer: 3 },
        { type: 'calculation', question: "Tìm PTTT của đồ thị \( y = x^4 - 2x^2 \) tại điểm có hoành độ \( x_0 = -1 \).", answer: { m: 0, c: -1 } }
    ];

    // --- State ---
    let currentQuestionIndex = 0;
    let userAnswers = new Array(quizData.length).fill(null);
    const TOLERANCE = 0.01;

    // --- DOM Elements ---
    const dom = {
        questionNumber: document.getElementById('question-number'),
        questionText: document.getElementById('question-text'),
        calcContainer: document.getElementById('calculation-answer-container'),
        mInput: document.getElementById('m-input'),
        cInput: document.getElementById('c-input'),
        submitCalcBtn: document.getElementById('submit-calc-btn'),
        theoryContainer: document.getElementById('theory-answer-container'),
        feedbackContainer: document.getElementById('feedback-container'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        questionGrid: document.getElementById('question-grid'),
        submitAllBtn: document.querySelector('.submit-all-btn'),
        modal: document.getElementById('result-modal'),
        scoreText: document.getElementById('score-text'),
        closeModalBtn: document.querySelector('.close-btn'),
        restartBtn: document.getElementById('restart-btn'),
        correctSound: document.getElementById('correct-sound'),
        incorrectSound: document.getElementById('incorrect-sound'),
    };

    // --- Functions ---
    const renderQuestionGrid = () => {
        dom.questionGrid.innerHTML = '';
        quizData.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.classList.add('question-nav-btn');
            btn.textContent = (index + 1).toString().padStart(2, '0');
            btn.addEventListener('click', () => navigateToQuestion(index));
            dom.questionGrid.appendChild(btn);
        });
    };

    const updateGridButtons = () => {
        const buttons = dom.questionGrid.children;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active', 'answered', 'correct', 'incorrect');
            if (i === currentQuestionIndex) {
                buttons[i].classList.add('active');
            }
            if (userAnswers[i] !== null) {
                buttons[i].classList.add('answered', userAnswers[i].isCorrect ? 'correct' : 'incorrect');
            }
        }
    };
    
    const loadQuestion = (index) => {
        currentQuestionIndex = index;
        const question = quizData[index];
        
        dom.questionNumber.textContent = `Câu ${index + 1}`;
        dom.questionText.innerHTML = question.question;
        dom.feedbackContainer.textContent = '';
        dom.feedbackContainer.className = '';

        // Hiển thị/ẩn các loại câu trả lời
        dom.calcContainer.classList.toggle('hidden', question.type !== 'calculation');
        dom.theoryContainer.classList.toggle('hidden', question.type !== 'theory');

        if (question.type === 'calculation') {
            dom.mInput.value = '';
            dom.cInput.value = '';
            dom.mInput.disabled = false;
            dom.cInput.disabled = false;
            dom.submitCalcBtn.disabled = false;
        } else {
            dom.theoryContainer.innerHTML = '';
            question.options.forEach((option, optionIndex) => {
                const button = document.createElement('button');
                button.innerHTML = option;
                button.classList.add('option-btn');
                button.addEventListener('click', () => checkAnswer({ theoryAnswer: optionIndex }));
                dom.theoryContainer.appendChild(button);
            });
        }

        // Khôi phục câu trả lời nếu đã có
        const savedAnswer = userAnswers[index];
        if (savedAnswer) {
            if (question.type === 'calculation') {
                dom.mInput.value = savedAnswer.userAnswer.m;
                dom.cInput.value = savedAnswer.userAnswer.c;
                dom.mInput.disabled = true;
                dom.cInput.disabled = true;
                dom.submitCalcBtn.disabled = true;
            } else {
                const optionButtons = dom.theoryContainer.children;
                optionButtons[savedAnswer.userAnswer].classList.add(savedAnswer.isCorrect ? 'correct' : 'incorrect');
                if (!savedAnswer.isCorrect) {
                    optionButtons[question.answer].classList.add('correct');
                }
                Array.from(optionButtons).forEach(btn => btn.disabled = true);
            }
        }

        // Cập nhật nút điều hướng
        dom.prevBtn.disabled = index === 0;
        dom.nextBtn.disabled = index === quizData.length - 1;

        updateGridButtons();
        if (window.MathJax) MathJax.typesetPromise();
    };

    const checkAnswer = (answer) => {
        const question = quizData[currentQuestionIndex];
        let isCorrect = false;
        let userAnswer = null;
        
        if (question.type === 'calculation') {
            const m = parseFloat(dom.mInput.value);
            const c = parseFloat(dom.cInput.value);
            if(isNaN(m) || isNaN(c)) { alert('Vui lòng nhập đáp án hợp lệ.'); return; }

            userAnswer = { m, c };
            isCorrect = Math.abs(m - question.answer.m) < TOLERANCE && Math.abs(c - question.answer.c) < TOLERANCE;
            dom.mInput.disabled = true;
            dom.cInput.disabled = true;
            dom.submitCalcBtn.disabled = true;
        } else { // Theory
            userAnswer = answer.theoryAnswer;
            isCorrect = userAnswer === question.answer;
            const optionButtons = dom.theoryContainer.children;
            if (!isCorrect) {
                optionButtons[question.answer].classList.add('correct');
            }
            optionButtons[userAnswer].classList.add(isCorrect ? 'correct' : 'incorrect');
            Array.from(optionButtons).forEach(btn => btn.disabled = true);
        }

        userAnswers[currentQuestionIndex] = { userAnswer, isCorrect };

        dom.feedbackContainer.textContent = isCorrect ? 'Chính xác!' : 'Không chính xác!';
        dom.feedbackContainer.className = isCorrect ? 'correct' : 'incorrect';
        (isCorrect ? dom.correctSound : dom.incorrectSound).play();
        updateGridButtons();
    };
    
    const navigateToQuestion = (index) => {
        if (index >= 0 && index < quizData.length) {
            loadQuestion(index);
        }
    };
    
    const showFinalResults = () => {
        const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
        dom.scoreText.textContent = `Bạn đã trả lời đúng ${correctCount} / ${quizData.length} câu.`;
        dom.modal.classList.remove('hidden');
    };
    
    const restartQuiz = () => {
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        dom.modal.classList.add('hidden');
        loadQuestion(0);
    };

    // --- Event Listeners ---
    dom.prevBtn.addEventListener('click', () => navigateToQuestion(currentQuestionIndex - 1));
    dom.nextBtn.addEventListener('click', () => navigateToQuestion(currentQuestionIndex + 1));
    dom.submitCalcBtn.addEventListener('click', () => checkAnswer({}));
    dom.submitAllBtn.addEventListener('click', showFinalResults);
    dom.closeModalBtn.addEventListener('click', () => dom.modal.classList.add('hidden'));
    dom.restartBtn.addEventListener('click', restartQuiz);
    
    // --- Initial Load ---
    renderQuestionGrid();
    loadQuestion(0);
});