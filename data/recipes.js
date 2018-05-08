const mongoCollections = require("../config/mongoCollections");
const recipes = mongoCollections.recipes;
const uuid = require("uuid/v4");

const exportedMethod = {
    async getAllRecipes(){
        const recipesCollection = await recipes();
        return await recipesCollection.find({}).toArray();
    },

    async getRecipeById(id){
        if(!id) throw "No recipe ID provided!";
        const recipesCollection = await recipes();
        const getInfo = await recipesCollection.find({id : id}).toArray();
        if(getInfo === 0) throw "No such recipe in Database"
    },

    async createRecipe(recipeinfo){
        const newRecipe = {
            id : uuid(),
            title : recipeinfo.title,
            category: recipeinfo.category,
            likes : 0,
            posterID : recipeinfo.posterID,
            ingredients : recipeinfo.ingredients,
            steps : recipeinfo.steps,
            comment : []
        };
        const recipeCollection = await recipes();
        const insertInfo = await recipeCollection.insertOne(newRecipe);
        if(insertInfo === 0) throw "Can not insert a new recipe!";
        return this.getRecipeById(insertInfo.insertedId);
    },

    async updateRecipe(id, recipe){
        const recipeCollection = await recipes();
        const updateData = {};
        if(recipe.title){
            updateData.title = recipe.title;
        }
        updateData.likes = recipe.likes;
        if(recipe.ingredients){
            updateData.ingredients = recipe.ingredients;
        }
        if(recipe.steps){
            updateData.steps = recipe.steps;
        }
        if(recipe.comment){
            updateData.comment = recipe.comment;
        }
        const updateInfo = await recipeCollection.updateOne({id : id}, {$set : updateData});
        if(updateInfo === null) throw "Can not update this recipe!";

        return await this.getRecipeById(id);
    },

    async removeRecipe(id){
        if(!id) throw "No recipe ID provided!";
        const recipeCollection = await recipes();
        const deleteInfo = await recipeCollection.removeOne({id : id});
        if(deleteInfo === 0) throw "Can not delete recipe by given id!";
    }
};

module.exports = exportedMethod;
