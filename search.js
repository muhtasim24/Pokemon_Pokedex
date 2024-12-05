const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");
const sort_wrapper = document.querySelector(".sort-wrapper");

inputElement.addEventListener("input", () => {
    handleInputChange(inputElement);
});
search_icon.addEventListener("click", () => {
    handleSearchCloseOnClick;
});
sort_wrapper.addEventListener("click", () => {
    handleSortIconOnClick;
});

function handleInputChange(inputElement) {
    const inputValue = inputElement.value;

    if (inputValue !== ""){
        document.querySelector("search-close-icon").classList.add("search-close-icon-visible"); // targeting if its visible or not
    } else {
        document.querySelector("search-close-icon").classList.remove("search-close-icon-visible");
    }
}


