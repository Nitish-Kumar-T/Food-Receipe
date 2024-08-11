const apiKey = 'f842089f19a84357b8edb76b014d278f';
const apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';

let recipes = [];
let favorites = [];
let mealPlan = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
};
let shoppingList = [];

async function fetchRecipes(query = '') {
    try {
        const response = await fetch(`${apiUrl}?apiKey=${apiKey}&query=${query}&number=10&addRecipeInformation=true`);
        const data = await response.json();
        console.log('API response:', data);
        recipes = data.results || [];
        displayRecipeCards(recipes);
        populateFilters();
        setRecipeOfTheDay();
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayRecipeCards(recipesToDisplay = recipes) {
    const recipeGrid = document.getElementById('recipeGrid');
    recipeGrid.innerHTML = '';

    if (recipesToDisplay.length === 0) {
        recipeGrid.innerHTML = '<p>No recipes available.</p>';
        return;
    }

    recipesToDisplay.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${recipe.image || 'default-image.jpg'}" alt="${recipe.title || 'Recipe Image'}">
            <h3>${recipe.title || recipe.name || 'Unnamed Recipe'}</h3>
            <div class="recipe-meta">
                <span>${recipe.dishTypes?.[0] || 'Not specified'}</span>
                <span class="rating">★ ${recipe.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : 'N/A'}</span>
            </div>
            <p>Prep: ${recipe.preparationMinutes || 'N/A'} | Cook: ${recipe.cookingMinutes || 'N/A'}</p>
            <button onclick="showFullRecipe(${recipe.id})">View Recipe</button>
            <button onclick="toggleFavorite(${recipe.id})">
                ${favorites.includes(recipe.id) ? '❤️' : '🤍'}
            </button>
            <button onclick="addToMealPlan(${recipe.id})">Add to Meal Plan</button>
        `;
        recipeGrid.appendChild(card);
    });
}

function showFullRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) {
        alert('Recipe not found!');
        return;
    }

    const recipeGrid = document.getElementById('recipeGrid');
    recipeGrid.innerHTML = `
        <div class="full-recipe">
            <h2>${recipe.title || 'Untitled Recipe'}</h2>
            <img src="${recipe.image || 'default-image.jpg'}" alt="${recipe.title || 'Recipe Image'}">
            <p>Category: ${recipe.dishTypes?.join(', ') || 'Not specified'}</p>
            <p>Diet: ${recipe.diets?.join(', ') || 'Not specified'}</p>
            <p>Prep Time: ${recipe.preparationMinutes || 'N/A'} | Cook Time: ${recipe.cookingMinutes || 'N/A'}</p>
            <p>Servings: ${recipe.servings || 'N/A'}</p>
            <div class="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                    ${recipe.extendedIngredients ? recipe.extendedIngredients.map(ingredient => `<li>${ingredient.name}</li>`).join('') : '<li>No ingredients listed</li>'}
                </ul>
            </div>
            <div class="instructions">
                <h3>Instructions:</h3>
                <ol>
                    ${recipe.instructions ? recipe.instructions.split('.').map(instruction => `<li>${instruction.trim()}</li>`).join('') : '<li>No instructions listed</li>'}
                </ol>
            </div>
            <div class="nutrition">
                <h3>Nutrition Information:</h3>
                <p>Calories: ${recipe.nutrition?.nutrients?.find(nutrient => nutrient.name === 'Calories')?.amount || 'N/A'}</p>
                <p>Protein: ${recipe.nutrition?.nutrients?.find(nutrient => nutrient.name === 'Protein')?.amount || 'N/A'}g</p>
                <p>Carbs: ${recipe.nutrition?.nutrients?.find(nutrient => nutrient.name === 'Carbohydrates')?.amount || 'N/A'}g</p>
                <p>Fat: ${recipe.nutrition?.nutrients?.find(nutrient => nutrient.name === 'Fat')?.amount || 'N/A'}g</p>
            </div>
            <div class="social-share">
                <button onclick="shareRecipe('facebook', ${recipe.id})" class="facebook">
                    <span class="icon">🔵</span>
                    <span>Share on Facebook</span>
                </button>
                <button onclick="shareRecipe('twitter', ${recipe.id})" class="twitter">
                    <span class="icon">🐦</span>
                    <span>Share on Twitter</span>
                </button>
            </div>
            <button onclick="addToShoppingList(${recipe.id})">Add to Shopping List</button>
            <button onclick="displayRecipeCards()">Back to Recipes</button>
        </div>
    `;
}

function searchRecipes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.dishTypes?.some(type => type.toLowerCase().includes(searchTerm)) ||
        (recipe.extendedIngredients && recipe.extendedIngredients.some(ingredient => ingredient.name.toLowerCase().includes(searchTerm)))
    );
    displayRecipeCards(filteredRecipes);
}

function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    displayRecipeCards();
}

function shareRecipe(platform, id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) {
        alert('Recipe not found!');
        return;
    }

    let shareUrl;
    const currentUrl = encodeURIComponent(window.location.href);

    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this ${recipe.title || recipe.name} recipe!`)}&url=${currentUrl}`;
            break;
    }

    window.open(shareUrl, '_blank');
}

function setRecipeOfTheDay() {
    if (recipes.length > 0) {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        const recipeOfTheDay = recipes[randomIndex];
        document.querySelector('#recipeOfTheDay span').textContent = recipeOfTheDay.title || recipeOfTheDay.name;
    } else {
        document.querySelector('#recipeOfTheDay span').textContent = 'No Recipe Available';
    }
}

function populateFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const dietFilter = document.getElementById('dietFilter');
    
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    dietFilter.innerHTML = '<option value="">All Diets</option>';
    
    const categories = [...new Set(recipes.flatMap(recipe => recipe.dishTypes || []))];
    const diets = [...new Set(recipes.flatMap(recipe => recipe.diets || []))];

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    diets.forEach(diet => {
        const option = document.createElement('option');
        option.value = diet;
        option.textContent = diet;
        dietFilter.appendChild(option);
    });
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const dietFilter = document.getElementById('dietFilter').value;
    
    const filteredRecipes = recipes.filter(recipe =>
        (categoryFilter === '' || recipe.dishTypes?.includes(categoryFilter)) &&
        (dietFilter === '' || recipe.diets?.includes(dietFilter))
    );
    
    displayRecipeCards(filteredRecipes);
}

function addToMealPlan(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) {
        alert('Recipe not found!');
        return;
    }

    const day = prompt('Enter the day of the week (e.g., monday, tuesday, etc.):').toLowerCase();
    if (mealPlan[day]) {
        mealPlan[day].push(recipe);
        alert(`${recipe.title || 'Recipe'} added to ${day.charAt(0).toUpperCase() + day.slice(1)}'s meal plan.`);
    } else {
        alert('Invalid day. Please enter a valid day of the week.');
    }
}

function showShoppingList() {
    const modal = document.getElementById('shoppingListModal');
    const shoppingListContainer = document.getElementById('shoppingListContainer');
    shoppingListContainer.innerHTML = '';

    if (shoppingList.length > 0) {
        shoppingList.sort().forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = ingredient;
            shoppingListContainer.appendChild(listItem);
        });
    } else {
        shoppingListContainer.innerHTML = '<p>No items in the shopping list.</p>';
    }

    modal.style.display = 'block';
}

function addToShoppingList(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) {
        alert('Recipe not found!');
        return;
    }

    recipe.extendedIngredients?.forEach(ingredient => {
        if (!shoppingList.includes(ingredient.name)) {
            shoppingList.push(ingredient.name);
        }
    });
    alert(`${recipe.title || 'Recipe'} ingredients added to shopping list!`);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('dietFilter').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', searchRecipes);
});