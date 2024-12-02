let currentPokemonId = null;

// listen to the whole page
document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMONS = 151;
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10); // get the pokemon ID, which is a string, and turns into an integer, 10 decimal

    if (id < 1 || id > MAX_POKEMONS) {
        return (window.location.href = "./index.html");
    }

    currentPokemonId = id;
    loadPokemon(id);
})

async function loadPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>  
            res.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => 
            res.json()
        ),
    ]);

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    abilitiesWrapper.innerHTML = ""; // clearing it if we are on a previous pokemon

    if (currentPokemonId === id){
        displayPokemonDetails(pokemon);
        const flavorText = getEnglishFlavorText(pokemonSpecies);
        document.querySelector("body3-fonts.pokemon-description").textContent = flavorText;
    
    const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) => 
        document.querySelector(sel)
        );
        // when we click on left or right arrows, we will call navigate pokemon function
        leftArrow.removeEventListener("click", navigatePokemon);
        rightArrow.removeEventListener("click", navigatePokemon);

        // taking us to either previous pokemon or the next pokemon, depending on which arrow is clicked
        if (id !== 1) {
            leftArrow.addEventListener("click", () => {
                navigatePokemon(id - 1);
            });
        }
        if (id !== MAX_POKEMON) {
            rightArrow.addEventListener("click", () => {
                navigatePokemon(id + 1);
            })
        }

        window.history.pushState({}, "", `./detail.html?id=${id}`); // pushes into the history of the window, changes the url without reloading the page, Single Page Application
    }


    return true;
    }
    catch (error){
        console.error("An error occurred while fetching Pokemon data:", error);
        return false;
    }
}

async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);
}

// change the background of text, based on the type of the pokemon
const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    dark: "#EE99AC",
};

