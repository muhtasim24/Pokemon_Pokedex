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
    displayPokemons(allPokemons);
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

function displayPokemons(pokemon) {
    listWrapper.innerHTML = ""; // everytime we fetch we clear the innerHTML
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6]; // when we split the url, after the 6th slash is the specifc pokemon we are trying to get

        //creating html element in our js
        const listItem = document.createElement("div");
        // listItem is the card for each pokemon
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        `;

    // when card is clicked, it will call our async function and that will redirect us to the details page of that pokemon
    listItem.addEventListener("click", async () => {
        const success = await fetchPokemonDataBeforeRedirect(pokemonID);
        if (success) {
            window.location.href = `./detail.html?id=${pokemonID}`
        }
    })
    // adding listItems to listWrapper
    listWrapper.appendChild(listItem);

    });
}