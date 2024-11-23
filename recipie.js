let ingredients = [];

const inputElement = document.getElementById("input-element");
const addButton = document.getElementById("add-button");
const ingredientList = document.getElementById("ingredient-list");
const recipieList = document.getElementById("recipie-list");
const generateRecipiesButton = document.getElementById("generate-recepies-button");


addButton.addEventListener("click", function() {
    const ingredient = inputElement.value.trim();
    if (ingredient) {
        ingredients.push(ingredient);
        inputElement.value = "";
        displayIngredients();
    }
});


function displayIngredients() {
    ingredientList.innerHTML = "";
    for (let i = 0; i < ingredients.length; i++) {
        const items = document.createElement("li");
        items.textContent = ingredients[i];
        ingredientList.appendChild(items);
    }
}


async function recepies() {
    const apiKey = "08dd092dc6e64dbf9a9b95ef63befabb";
    const ingredientString = ingredients.join(",");

    try {

        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientString}&number=5&apiKey=${apiKey}`);
        const recipes = await response.json();
        
        for (let recipe of recipes) {
            const recipeDetails = await getRecipeDetails(recipe.id, apiKey);
            displayRecipeDetails(recipeDetails);
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}



async function getRecipeDetails (recipeId, apiKey){
    try{
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        return await response.json();
    } catch(error){
        console.log("Error fetching recipe details:", error)
    }
    
}


function displayRecipeDetails(recipe){
    const listItem = document.createElement("div");
    listItem.classList.add("recipe-item")
    listItem.innerHTML = `
        <h3>${recipe.title}</h3>
        <img src="${recipe.image}" alt="${recipe.title}" width="150">
        <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions || "No instructions available."}</p>
        <h4>Ingredients:</h4>
        <ul>
            ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join("")}
        </ul>
    `;
    recipieList.appendChild(listItem);
}

generateRecipiesButton.addEventListener("click", function(){
    recipieList.innerHTML = "";
    if (ingredients.length > 0){
        recepies();
    } else {
        alert("Please add at least one ingredient to generate recipes.");
    }
});