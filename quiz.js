// Retrieve DOM elements
// to manipulate html elements, need to access them in JS

let gameData;
const main = document.querySelector('main');
const playBtn = document.querySelector('play');

playBtn.addEventListener('click', fetchData);

