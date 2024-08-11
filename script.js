document.addEventListener('DOMContentLoaded', function () {
    const recipeLinks = document.querySelectorAll('#recipe-list a');
    const recipeContent = document.getElementById('recipe-content');

    recipeLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const recipeId = this.getAttribute('data-recipe-id');
            loadRecipeDetails(recipeId);
        });
    });

    function loadRecipeDetails(recipeId) {
        const recipes = {
            1: {
                title: 'Spaghetti Carbonara',
                ingredients: 'Spaghetti, Eggs, Parmesan Cheese, Pancetta, Black Pepper',
                instructions: 'Boil pasta, mix eggs and cheese, cook pancetta, combine all.'
            },
            2: {
                title: 'Chicken Alfredo',
                ingredients: 'Chicken, Fettuccine, Butter, Heavy Cream, Parmesan Cheese',
                instructions: 'Cook chicken, boil pasta, make Alfredo sauce, combine all.'
            },
            3: {
                title: 'Beef Tacos',
                ingredients: 'Ground Beef, Taco Shells, Lettuce, Cheese, Salsa',
                instructions: 'Cook beef, assemble tacos, add toppings.'
            }
        };

        const recipe = recipes[recipeId];
        recipeContent.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        `;
    }
});
