const express = require("express");
const router = express.Router();
const data = require("../data");
const recipes = data.recipes;
const categories = data.categories;



router.get("/:id", async(req,res)=>{
    let login = false;
    if(req.session.user !== undefined){
        login = true;
    }
    const getCategory = await categories.getCategoryById(req.params.id);
    let category = {};
    category.name = getCategory[0].name;
    const recipes_id = getCategory[0].recipes;
    let recipes_content = [];
    for(let i = 0; i < recipes_id.length; i++){
        let singlerecipe = await recipes.getRecipeById(recipes_id[i]);
        let recipe_temp = {
            _id : singlerecipe[0]._id,
            title : singlerecipe[0].title,
            picture : singlerecipe[0].picture
        };
        recipes_content.push(recipe_temp);
    }
    category.recipe = recipes_content;
    res.render("categories/category-content",{category : category,
                                              login : login,
                                              user : req.session.user});
});

module.exports = router;