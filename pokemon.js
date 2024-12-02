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
});

// there is a few milliseconds where the api is being retrieved,
// so if we try to call a function where we try to use the data, or use the data at all, within the time where the data from an api is Still being retrived, we will get an error, since all the data is not retrived yet
// so with the async keyword, it waits until the data is done being retrived then the function is ran

// Trying to fetch the pokemon, and species, and returning true if we get it
async function fetchPokemonDataBeforeRedirect(id) {
    try {
        // await keyword, delays till we get our data
        // A Promise is an object that represents an eventual completion of an async operation (await, async)
        // Promise is a trust system
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>  // then we get the data we are promised
            res.json() // we turned it into JSON
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => 
            res.json()
        ),
    ])
    return true // if we successfully retrieve, return true
    // if something fails, we catch the error, and print the error
    } catch (error) {
        console.error("Failed to fetch Pokemon data before redirect");
    }
}