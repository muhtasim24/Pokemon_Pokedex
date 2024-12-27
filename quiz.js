// Retrieve DOM elements
// to manipulate html elements, need to access them in JS

let gameData;
const main = document.querySelector('main');
const pokemonImage = document.querySelector('#pokemon-image');
const playBtn = document.querySelector('#play');
const choices = document.querySelector('#choices');
const textOverlay = document.querySelector('#text-overlay');
loadVoice();

addAnswerHandler();
playBtn.addEventListener('click', fetchData);

async function fetchData() {
    resetImage();
    gameData = await window.getPokeData();
    console.log(gameData);
    showSilhouette();
    displayChoices();
    speakQuestion();
}

function resetImage() {
    pokemonImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
    main.classList.add('fetching');
    main.classList.remove('revealed');
}

function showSilhouette() {
    main.classList.remove('fetching');
    pokemonImage.src = gameData.correct.image;
}

function displayChoices() {
    const { pokemonChoices } = gameData;
    const choicesHTML = pokemonChoices.map(({ name }) => {
        return `<button data-name="${name}">${name}</button>`
    }).join('');

    choices.innerHTML = choicesHTML;
}

function addAnswerHandler() {
    choices.addEventListener('click', e => {
        const { name } = e.target.dataset;
        const resultClass = (name === gameData.correct.name) ?
            'correct' : 'incorrect';
        
        e.target.classList.add(resultClass);
        revealPokemon();
        speakAnswer();
    })
}

function revealPokemon() {
    main.classList.add('revealed');
    textOverlay.textContent = `${gameData.correct.name}!`;
}

function loadVoice() {
    window.speechSynthesis.onvoiceschanged = () => {
        window.femaleVoice = speechSynthesis.getVoices()[4];
    }
}

function speakAnswer() {
    const utterance = new SpeechSynthesisUtterance(`It'ssss ${gameData.correct.name}`);
    utterance.voice = window.femaleVoice;
    utterance.pitch = 0.9;
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
}

function speakQuestion() {
    const utterance = new SpeechSynthesisUtterance(`Who's that Pokemon!`);
    utterance.voice = window.femaleVoice;
    utterance.pitch = 0.9;
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
}