const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipes.models");

initializeDatabase();
app.use(express.json());

//3. Create an API with route "/recipes" to create a new recipe in the recipes database. Make sure to handle errors properly. Test your API with Postman. Add the following recipe:
async function createNewRecipe(newRecipe){
    try {
        const recipe = new Recipe(newRecipe)
        const saveRecipe = await recipe.save()
        return saveRecipe
    } catch (error) {
        throw error
    }
}

app.post("/recipes", async(req, res) => {
    try {
        const savedRecipe = await createNewRecipe(req.body)
        res.status(201).json({message: "Recipe addedd successfully.", recipe: savedRecipe})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Failed to add Recipe."})
    }
})

//6. Create an API to get all the recipes in the database as a response. Make sure to handle errors properly.
async function getAllRecipes(){
    try {
        const allRecipes = await Recipe.find()
        return allRecipes
    } catch (error) {
        throw error
    }
}

app.get("/recipes", async(req, res) => {
    try {
        const recipes = await getAllRecipes()
        if(recipes.length != 0){
            res.json({message: "All Recipes fetch.", recipe: recipes})
        } else {
            res.status(404).json({error: "No Recipes found."})
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Failed to fetch recipes."})
    }
})

//7. Create an API to get a recipe's details by its title. Make sure to handle errors properly.
async function getRecipesByTitle(recipeTitle){
    try {
        const recipeByTitle = await Recipe.findOne({title: recipeTitle})
        return recipeByTitle
    } catch (error) {
        throw error
    }
}

app.get("/recipes/title/:recipeTitle", async(req, res) => {
    try {
        const recipe = await getRecipesByTitle(req.params.recipeTitle)
        if(recipe.length != 0){
            res.json({message: "Recipe fetch by title.", recipe: recipe})
        } else {
            res.status(404).json({error: "No Recipe found."})
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Failed to fetch recipe by title."})
    }
})

//8. Create an API to get details of all the recipes by an author. Make sure to handle errors properly.
async function getRecipeByAuthor(recipeAuthor){
    try {
        const recipeByAuthor = await Recipe.find({author: recipeAuthor})
        return recipeByAuthor       
    } catch (error) {
        throw error
    }
}

app.get("/recipes/author/:recipeAuthor", async(req, res) => {
    try {
        const recipe = await getRecipeByAuthor(req.params.recipeAuthor)
        if(recipe.length != 0){
            res.json({message: "Recipes fetch by author.", recipe: recipe})
        } else {
            res.status(404).json({error: "No Recipe found."})
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Failed to fetch recipe by author."})
    }
})

//9. Create an API to get all the recipes that are of "Easy" difficulty level.
async function getRecipeByDifficulty(recipeDifficulty){
    try {
        const recipeByDifficulty = await Recipe.find({difficulty: recipeDifficulty})
        return recipeByDifficulty
    } catch (error) {
        throw error
    }
}

app.get("/recipes/difficulty/:recipeDifficulty", async(req, res) => {
    try {
        const recipe = await getRecipeByDifficulty(req.params.recipeDifficulty)
        if(recipe.length != 0){
             res.json({message: "Recipes fetch by difficulty level.", recipe: recipe})
        } else {
            res.status(404).json({error: "No Recipe found."})
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Failed to fetch recipe by difficulty level."})
    }
})

//10. Create an API to update a recipe's difficulty level with the help of its id. Update the difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.
async function updateRecipe(recipeId, dataToUpdate){
    try {
        const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true})
        return updateRecipe
    } catch (error) {
        console.log("Error in updating recipe.", error)
    }
}

app.post("/recipes/:recipeId", async(req, res) => {
    try {
        const updatedRecipe = await updateRecipe(req.params.recipeId, req.body)
        if (!updatedRecipe) {
            return res.status(404).json({ error: "Recipe not found." });
        }
        res.status(201).json({message: "Recipe difficulty level is updated successfully.", recipe: updatedRecipe})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Failed to update recipe difficulty level."})
    }
})

//11. Create an API to update a recipe's prep time and cook time with the help of its title. Update the details of the recipe "Chicken Tikka Masala". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.
async function updateRecipe(recipeTitle, dataToUpdate){
    try {
        const updateRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true})
        return updateRecipe
    } catch (error) {
        console.log("Error in updating recipe.", error)
    }
}
app.post("/recipes/title/:recipeTitle", async(req, res) => {
    try {
        const updatedRecipe = await updateRecipe(req.params.recipeTitle, req.body)
        
        if (!updatedRecipe) {
            return res.status(404).json({ error: "Recipe not found." });
        }
        res.status(201).json({message: "Recipe preptime & cooktime is updated successfully.", updatedRecipe})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Failed to update recipe preptime & cooktime."})
    }
})

//12. Create an API to delete a recipe with the help of a recipe id. Send an error message "Recipe not found" if the recipe does not exist. Make sure to handle errors properly.
async function deleteRecipe(recipeId) {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  } catch (error) {
    throw error;
  }
}

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.recipeId);

    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    res.status(200).json({
      message: "Recipe deleted successfully.",
      deletedRecipe: deletedRecipe
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete recipe." });
  }
});


const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server running on PORT ${PORT}`)
});