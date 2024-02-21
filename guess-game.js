let gameName = 'Guess The Word';
document.title = gameName;
document.querySelector('h1').innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} Game By Mennat-Allah @ ${new Date().getFullYear()}`;

//Set Game Intro
let introP = document.querySelector(`.intro`);
let i = 0;
function intro() {
    if (i < gameName.length) {
        introP.innerHTML += gameName[i];
        i++;
        setTimeout(intro, 200);
    }
};
intro();
setTimeout(() => {
    introP.parentElement.remove();
    document.getElementById("start").play();
}, 4500)

//Catch Elements
let inputsContainer = document.querySelector('.inputs');
let chckBtn = document.querySelector('.control .chck');
let hintsBtn = document.querySelector('.control .hints');
let msgArea = document.querySelector(`.message`);

// Set Important Variables
let lettersNum = 6;
let triesNum = 6;
let current = 1;
let hintsNum = 2;

//Set Random Word To Guess
let words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
let wordToGuess = "";
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
console.log(wordToGuess);

function generateInputs() {
    //Generat Tries
    for (let i = 1; i <= triesNum; i++) {
        const tryDiv = document.createElement('div');
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        if (i !== 1) tryDiv.classList.add(`disabled`);
        //Generate Inputs
        for (let j = 1; j <= lettersNum; j++) {
            const input = document.createElement(`input`);
            input.type = `text`;
            input.setAttribute("max-length", 1);
            input.id = `try-${i}-letter-${j}`;

            tryDiv.appendChild(input);
        }

        inputsContainer.appendChild(tryDiv);
    }

    inputsContainer.children[0].children[1].focus();

    const disabledInputs = document.querySelectorAll(`.disabled input`);
    disabledInputs.forEach((input) => input.disabled = true);

    const inputs = document.querySelectorAll(`input`);

    inputs.forEach((input, inputIndex) => {
        input.addEventListener("input", function () {
            input.value = input.value.toUpperCase();
            const nextInput = inputs[inputIndex + 1];
            const enabledInputs = document.querySelectorAll(`input:not([disabled])`);
            if (Array.from(enabledInputs).indexOf(nextInput) !== -1) {
                nextInput.focus();
            } else {
                chckBtn.focus();
            }
        });

        input.addEventListener("keydown", function(event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if (event.key === "ArrowRight") {
                const nextIndex = currentIndex + 1;
                if (nextIndex < inputs.length) inputs[nextIndex].focus();
            }
            if (event.key === "ArrowLeft") {
                const prevIndex = currentIndex - 1;
                if (prevIndex >= 0) inputs[prevIndex].focus();
            }
        })
    })
}

chckBtn.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGuess = true;

    for (let i = 1; i <= lettersNum; i++) {
        const targetInput = document.querySelector(`#try-${current}-letter-${i}`);
        const letter = targetInput.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        if (letter === actualLetter) {
            targetInput.classList.add(`yes-in-place`);
        } else if (wordToGuess.includes(letter) && letter !== "") {
            targetInput.classList.add(`not-in-place`);
            successGuess = false;
        } else {
            targetInput.classList.add(`wrong`);
            successGuess = false;
        }
    }

    if (successGuess) {
        msgArea.innerHTML = `Winner, You Got The Right Word <span>${wordToGuess}</span>`;
        if (hintsNum === 2) {
            msgArea.innerHTML = `Congrats, You Got The Right Word <span>${wordToGuess}</span><p>Without Using Hints</p>`;
            setTimeout(() => {
                msgArea.innerHTML = "";
                startAgainBtn();
            }, 4000)
        }
        setTimeout(() => {
            msgArea.innerHTML = "";
            startAgainBtn();
        }, 4000)
        chckBtn.disabled = true;
        hintsBtn.disabled = true;
        const allTries = document.querySelectorAll(`.inputs > div`);
        allTries.forEach((theTry) => theTry.classList.add('disabled'));
    } else {
        const currentInput = document.querySelector(`.try-${current}`);
        currentInput.classList.add('disabled');
        const currentInputs = document.querySelectorAll(`.try-${current} input`);
        currentInputs.forEach((input) => input.disabled = true);
        
        current++;

        const nextInput = document.querySelector(`.try-${current}`);
        if (nextInput) {
            nextInput.classList.remove(`disabled`);
            const nextInputs = document.querySelectorAll(`.try-${current} input`);
            nextInputs.forEach((input) => input.disabled = false);
            nextInput.children[1].focus();
        } else {
            msgArea.innerHTML = `You Lose, The Right Word Is <span>${wordToGuess}</span>`;
            setTimeout(() => {
                msgArea.innerHTML = "";
                startAgainBtn();
            }, 4000)
            chckBtn.disabled = true;
            hintsBtn.disabled = true;
        }
    }
}

document.querySelector(`.hints span`).innerHTML = hintsNum;
hintsBtn.addEventListener("click", handleHints);

function handleHints() {
    if (hintsNum > 0) {
        hintsNum--;
        document.querySelector(`.hints span`).innerHTML = hintsNum;
    }
    if (hintsNum === 0) hintsBtn.disabled = true;

    const enabledInputs = document.querySelectorAll(`input:not([disabled])`);
    const emptyInputs = Array.from(enabledInputs).filter((input) => input.value === "");

    if (emptyInputs.length > 0) {
        const randomEmptyInput = emptyInputs[Math.floor(Math.random() * emptyInputs.length)];
        const indexToFill = Array.from(enabledInputs).indexOf(randomEmptyInput);
        if (indexToFill !== -1) randomEmptyInput.value = wordToGuess[indexToFill].toUpperCase();
    }
    
}

function handleBackspace(event) {
    if (event.key === "Backspace") {
        const currentInputs = document.querySelectorAll(`input:not([disabled])`);
        const currentIndex = Array.from(currentInputs).indexOf(document.activeElement);
        if (currentIndex > 0) {
            const currentInput = currentInputs[currentIndex];
            currentInput.value = "";
            const prevInput = currentInputs[currentIndex - 1];
            prevInput.value = "";
            prevInput.focus();
        }
    }
}

function startAgainBtn() {
    let btn = document.createElement('button');
    btn.innerHTML = `Start Again`;
    msgArea.appendChild(btn);
    btn.addEventListener("click", function () {
        window.location.reload();
    })
}

document.addEventListener('keydown', handleBackspace);

window.onload = function () {
    generateInputs();
}
