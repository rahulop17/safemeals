const unsafeIngredients = [
  "sugar", "honey", "syrup", "jaggery", "white rice", "white bread", 
  "sweetened", "glucose", "corn syrup", "molasses"
];

async function fetchRecipeDetails(mealId) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await res.json();
  const meal = data.meals[0];

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients.push(`${measure} ${ing}`);
    }
  }

  const detailsDiv = document.getElementById("results");
  detailsDiv.innerHTML = `
    <div class="meal">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Cuisine:</strong> ${meal.strArea}</p>
      <p><strong>Ingredients:</strong><br> ${ingredients.join("<br>")}</p>
      <p><strong>Instructions:</strong><br> ${meal.strInstructions}</p>
      <a href="${meal.strYoutube}" target="_blank">📺 Watch Video</a>
      <br><br>
      <button onclick="searchMeal()">⬅ Back to Recipes</button>
    </div>
  `;
}


async function searchMeal() {
  const query = document.getElementById("search").value;
  const category = document.getElementById("category").value;
  const cuisine = document.getElementById("cuisine").value;

    let apiURL = "";

    if (category) {
     apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    } else if (cuisine) {
     apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`;
    } else {
        apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    }

  const res = await fetch(apiURL);
  const data = await res.json();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!data.meals) {
    resultsDiv.innerHTML = `<p>No meals found.</p>`;
    return;
  }

 data.meals.forEach(meal => {
  const mealDiv = document.createElement("div");
  mealDiv.className = "meal";
  mealDiv.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <p><strong>Click to view full recipe</strong></p>
  `;

  mealDiv.addEventListener("click", () => {
    fetchRecipeDetails(meal.idMeal);
  });

  resultsDiv.appendChild(mealDiv);
});

}
