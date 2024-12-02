const MAX_POKEMON = 151; // # of pokemons we want to retrieve
// referencing html elements, and be used as constants so we can use them in this file
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = []; // array to store all our pokemons

// fetching the poke API, which gives us a response, "then" we do omething with that response
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json()) // we get a response and turn that into JSON
.then((data) => { // with the data we get, we put that into our allPokemons array
    allPokemons = data.results;
    console.log(data);
    console.log(data.results);
    console.log(data.results[0]);
    console.log(data.results[0].name);
    console.log(data.results[0].url);
})


