

// main function to get data from the api
window.getPokeData = async function() {
    const pokemon = await getPokemon();
    // shuffle the pokemons, so we get random pokemons
    const randomPokemon = shuffle(pokemon);
    console.log(randomPokemon);
    const pokemonChoices = get4Pokemon(randomPokemon);
    const [ firstPokemon ] = pokemonChoices; // get first item in the pokemonChoices array
    const number = getPokemonNumber(firstPokemon);
    const image = getPokemonImage(number);

    return {
        pokemonChoices,
        correct: {
            image,
            name: firstPokemon.name
        }
    };
};

async function getPokemon() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const pokemon = await res.json(); 

    return pokemon.results;

}

function shuffle(unshuffled) {
    // for every item in the unshuffled array
    // we want a new object that has the value 
    // and give each of the entries a random sort number
    const shuffled = unshuffled
        .map(value => ({value, sort: Math.random() }))
        .sort((a,b) => a.sort - b.sort)
        .map(( { value } ) => value);

    return shuffled;
}

// function to get first 4 options of the random array, one of them will be the correct pokemon
function get4Pokemon(randomPokemon) {
    return randomPokemon.splice(0,4);
}

// retrieving the id random pokemon
function getPokemonNumber({ url }) {
    // extracting pokemonId
    const numberRegEx = /(\d+)\/$/;
    return (url.match(numberRegEx) || [])[1];
}

// get the image of the pokemon based on the id of the random pokemon
function getPokemonImage(number) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`
}
