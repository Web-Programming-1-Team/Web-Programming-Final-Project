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
        const getInfo = await recipesCollection.find({_id : id}).toArray();
        if(getInfo === 0) throw "No such recipe in Database";
        return getInfo;
    },

    async createRecipe(recipeinfo){
        const newRecipe = {
            _id : uuid(),
            title : recipeinfo.title,
            category: recipeinfo.category,
            likes : 0,
            posterID : recipeinfo.posterID,
            picture: recipeinfo.picture,
            ingredients : recipeinfo.ingredients,
            steps : recipeinfo.steps,
            comment : [],
        };
        const recipeCollection = await recipes();
        const insertInfo = await recipeCollection.insertOne(newRecipe);
        if(insertInfo === 0) throw "Can not insert a new recipe!";
        const inserted_one = await this.getRecipeById(insertInfo.insertedId);
        return inserted_one;
    },

    async initRecipe(recipe) {
        const recipeCollection = await recipes();
        const insertInfo = await recipeCollection.insertOne(recipe);
        if (insertInfo === 0) throw "Can not insert a new recipe!";
        const inserted_one = await this.getRecipeById(insertInfo.insertedId);
        return inserted_one;
    },
    async createTop10Recipes(Top10info){
        const recipeCollection = await recipes();
        const insertInfo = await recipeCollection.insertOne(Top10info);
        if(insertInfo === 0) throw "Can not insert a new recipe!";
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
        const updateInfo = await recipeCollection.updateOne({_id : id}, {$set : updateData});
        if(updateInfo === null) throw "Can not update this recipe!";

        return await this.getRecipeById(id);
    },

    async removeRecipe(id){
        if(!id) throw "No recipe ID provided!";
        const recipeCollection = await recipes();
        const deleteInfo = await recipeCollection.removeOne({_id : id});
        if(deleteInfo === 0) throw "Can not delete recipe by given id!";
    },

    async getRecipeByKey(keyword){
        const recipeCollection = await recipes();
        const result = await recipeCollection.find({title: {$regex:keyword}}).toArray();
        return result;
    }
};

module.exports = exportedMethod;
