const recipes = [
    {
        id: 1,
        name: "Spaghetti Carbonara",
        category: "Dinner",
        ingredients: [
            "400g spaghetti",
            "200g pancetta",
            "4 large eggs",
            "100g Parmesan cheese",
            "Black pepper"
        ],
        instructions: [
            "Cook spaghetti according to package instructions.",
            "Fry pancetta until crispy.",
            "Beat eggs with grated Parmesan.",
            "Drain pasta, mix with pancetta, then quickly stir in egg mixture.",
            "Season with black pepper and serve immediately."
        ],
        prepTime: "10 minutes",
        cookTime: "15 minutes",
        servings: 4,
        rating: 4.5,
        nutrition: {
            calories: 600,
            protein: 25,
            carbs: 70,
            fat: 30
        }
    },
    {
        id: 2,
        name: "Classic Caesar Salad",
        category: "Lunch",
        ingredients: [
            "1 large romaine lettuce",
            "Croutons",
            "50g Parmesan cheese",
            "Caesar dressing"
        ],
        instructions: [
            "Wash and chop the romaine lettuce.",
            "Toss lettuce with Caesar dressing.",
            "Add croutons and grated Parmesan cheese.",
            "Serve chilled."
        ],
        prepTime: "15 minutes",
        cookTime: "0 minutes",
        servings: 2,
        rating: 4.2,
        nutrition: {
            calories: 350,
            protein: 10,
            carbs: 15,
            fat: 30
        }
    }
    // Add more recipes here...
];

let favorites = [];

function displayRecipeCards() {
    const recipeGrid = document.getElementById('recipeGrid');
    recipeGrid.innerHTML = '';
    if (recipes.length === 0) {
        recipeGrid.innerHTML = '<p>No recipes available.</p>';
        return;
    }
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <h3>${recipe.name}</h3>
            <div class="recipe-meta">
                <span>${recipe.category}</span>
                <span class="rating">★ ${recipe.rating.toFixed(1)}</span>
            </div>
            <p>Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime}</p>
            <button onclick="showFullRecipe(${recipe.id})">View Recipe</button>
            <button onclick="toggleFavorite(${recipe.id})">
                ${favorites.includes(recipe.id) ? '❤️' : '🤍'}
            </button>
        `;
        recipeGrid.appendChild(card);
    });
}

function showFullRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    const recipeGrid = document.getElementById('recipeGrid');
    recipeGrid.innerHTML = `
        <div class="full-recipe">
            <h2>${recipe.name}</h2>
            <p>Category: ${recipe.category}</p>
            <p>Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime}</p>
            <p>Servings: ${recipe.servings}</p>
            <div class="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            <div class="instructions">
                <h3>Instructions:</h3>
                <ol>
                    ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
            </div>
            <div class="nutrition">
                <h3>Nutrition Information:</h3>
                <p>Calories: ${recipe.nutrition.calories}</p>
                <p>Protein: ${recipe.nutrition.protein}g</p>
                <p>Carbs: ${recipe.nutrition.carbs}g</p>
                <p>Fat: ${recipe.nutrition.fat}g</p>
            </div>
            <div class="social-share">
                <button onclick="shareRecipe('facebook', ${recipe.id})" class="facebook">
                    <span class="icon">f</span>
                    <span>Share on Facebook</span>
                </button>
                <button onclick="shareRecipe('twitter', ${recipe.id})" class="twitter">
                    <span class="icon">t</span>
                    <span>Share on Twitter</span>
                </button>
            </div>
            <button onclick="displayRecipeCards()">Back to Recipes</button>
        </div>
    `;
}

function searchRecipes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.category.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
    );
    displayFilteredRecipes(filteredRecipes);
}

function displayFilteredRecipes(filteredRecipes) {
    const recipeGrid = document.getElementById('recipeGrid');
    recipeGrid.innerHTML = '';
    if (filteredRecipes.length === 0) {
        recipeGrid.innerHTML = '<p>No matching recipes found.</p>';
        return;
    }
    filteredRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <h3>${recipe.name}</h3>
            <div class="recipe-meta">
                <span>${recipe.category}</span>
                <span class="rating">★ ${recipe.rating.toFixed(1)}</span>
            </div>
            <p>Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime}</p>
            <button onclick="showFullRecipe(${recipe.id})">View Recipe</button>
            <button onclick="toggleFavorite(${recipe.id})">
                ${favorites.includes(recipe.id) ? '❤️' : '🤍'}
            </button>
        `;
        recipeGrid.appendChild(card);
    });
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
    let shareUrl;

    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this ${recipe.name} recipe!`)}&url=${encodeURIComponent(window.location.href)}`;
            break;
    }

    window.open(shareUrl, '_blank');
}

function setRecipeOfTheDay() {
    if (recipes.length > 0) {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        const recipeOfTheDay = recipes[randomIndex];
        document.querySelector('#recipeOfTheDay span').textContent = recipeOfTheDay.name;
    } else {
        document.querySelector('#recipeOfTheDay span').textContent = 'No Recipe Available';
    }
}

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

displayRecipeCards();
setRecipeOfTheDay();
