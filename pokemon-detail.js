let currentPokemonId = null;

// listen to the whole page
document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMONS = 493;
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

    console.log(pokemon);
    console.log(pokemonSpecies);

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    abilitiesWrapper.innerHTML = ""; // clearing it if we are on a previous pokemon

    if (currentPokemonId === id){
        displayPokemonDetails(pokemon);
        const flavorText = getEnglishFlavorText(pokemonSpecies);
        document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;
    
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
        if (id !== 493) {
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

// attaching the element styles to all the elements 
function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value;
    });
}

function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1,3), 16),
        parseInt(hexColor.slice(3,5), 16),
        parseInt(hexColor.slice(5,7), 16),  
    ].join(", "); // give our color a transluent effect towards the end of each stats bar
}

function setTypeBackgroundColor(pokemon) {
    const mainType = pokemon.types[0].type.name; // get the type of the pokemon
    const color = typeColors[mainType]; // use that type to access the color from our typeColors array


    if (!color) {
        console.warn(`Color not defined for type: ${mainType}`);
    }

    const detailMainElement = document.querySelector(".detail-main");
    setElementStyles([detailMainElement], "backgroundColor", color);
    setElementStyles([detailMainElement], "borderColor", color);
    setElementStyles(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", color);
    setElementStyles(document.querySelectorAll(".weakness-wrap > p"), "backgroundColor", color);
    setElementStyles(document.querySelectorAll(".stats-wrap p.stats"), "color", color);
    setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"), "color", color);

    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        .stats-wrap .progress-bar::-webkit-progress-bar {
            background-color: rgba(${rgbaColor}, 0.5);
        }
        .stats-wrap .progress-bar::-webkit-progress-value {
            background-color: ${color};
        }
    `;

    document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element)

    return element;
}

const weakness = {
    normal: ["Fighting"],
    fire: ["Water", "Rock", "Ground"],
    water: ['Grass', 'Electric'],
    grass: ["Fire", "Flying"],
    electric: ["Ground"],
    ice: ["Fire", "Fighting", "Rock", "Steel"],
    fighting: ["Flying", 'Psychic'],
    poison: ["Ground", "Psychic"],
    ground: ["Grass", 'Ice', 'Water'],
    flying: ['Electric', 'Rock', 'Ice'],
    psychic: ["Bug", "Dark", "Ghost"],
    bug: ['Fire', 'Flying', 'Rock'],
    rock: ["Fighting", "Grass", "Ground", "Steel", "Water"],
    ghost: ['Dark', "Ghost"],
    dragon: ['Dragon', 'Ice'],
    steel: ["Fighting", "Fire", "Ground"],
    dark: ['Bug', 'Fighting'],
}
function weakAgainst(types) {
    console.log(types);

    const weaknessWrapper = document.querySelector(".weakness-wrap");
    weaknessWrapper.innerHTML = "";
    // for each type
        
        types.forEach(({ type }) => {
            createAndAppendElement(weaknessWrapper, "p", {
            className:`body3-fonts type ${type.name}`,
            textContent: weakness[type.name][0], 
        });
    });
    // setElementStyles(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", color);

}

function displayPokemonDetails(pokemon) {
    const { name, id, types, weight, height, abilities, stats} = pokemon;
    const capitalizePokemonName = capitalizeFirstLetter(name);

    document.querySelector("title").textContent = capitalizePokemonName;

    const detailMainElement = document.querySelector(".detail-main");
    detailMainElement.classList.add(name.toLowerCase());

    document.querySelector(".name-wrap .name").textContent = capitalizePokemonName;

    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent =  `#${String(id).padStart(3, "0")}`;

    const imageElement = document.querySelector(".detail-img-wrapper img");
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    imageElement.alt = name;

    const typeWrapper = document.querySelector(".power-wrapper");
    typeWrapper.innerHTML = "";
    // for each type
        types.forEach(({ type }) => {
            createAndAppendElement(typeWrapper, "p", {
            className:`body3-fonts type ${type.name}`,
            textContent: type.name, 
        });
    });

    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight").textContent = `${weight / 10}kg`;
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height").textContent = `${height / 10}m`;

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-fonts",
            textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper");
    statsWrapper.innerHTML = "";

    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    };

    stats.forEach(({stat, base_stat}) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts stats",
            textContent: statNameMapping[stat.name],
        });

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts",
            textContent: String(base_stat).padStart(3, "0"),
        });

        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        });
    });

    weakAgainst(types);
    setTypeBackgroundColor(pokemon);

}

function getEnglishFlavorText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries){
        if (entry.language.name === "en") {
            let flavor = entry.flavor_text.replace(/\f/g, " ");
            return flavor;
        }
    }
    return "";
}