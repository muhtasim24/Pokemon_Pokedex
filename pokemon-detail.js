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