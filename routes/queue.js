const express = require("express");
const router = express.Router();
const data = require("../data");
const recipes = data.recipes;
const users = data.users;
const categories = data.categories;
const queue = data.queue;

router.get("/:id", async(req,res)=>{
    const id = req.params.id;
    const getQueue = await queue.getQueueById(id);
    const getUser = await users.getUserById(getQueue[0].recipe.posterID);
    getQueue[0].recipe.posterName = getUser[0].profile.nickname;
    res.render("queues/queue-recipe-content",{recipe : getQueue[0].recipe, id:id});
});


router.post("/:id/approve", async(req,res)=>{
    const getQueue = await queue.getQueueById(req.params.id);
    let category_name = getQueue[0].recipe.category;
    let getCategory = await categories.getCategoryByName(category_name);
    if(getCategory.length === 0){
        const category = {
            name : category_name,
        };
        await categories.createCategory(category);
    }
    getCategory = await categories.getCategoryByName(category_name);
    let newrecipe = getQueue[0].recipe;
    newrecipe.category = getCategory[0]._id;
    const create_result = await recipes.createRecipe(newrecipe);

    const posterID = newrecipe.posterID;
    const getUser = await users.getUserById(posterID);
    getUser[0].postlist.push(create_result[0]._id);
    await users.updateUser(posterID,getUser[0]);
    getCategory[0].recipes.push(create_result[0]._id);
    await categories.updateCategory(getCategory[0]._id, getCategory[0]);
    await queue.deleteQueue(getQueue[0]._id);

    res.redirect(`/private/${req.session.user._id}`);
});

router.post("/:id/deny", async(req,res)=>{
    await queue.deleteQueue(req.params.id);
    res.redirect(`/private/${req.session.user._id}`);
});



module.exports = router;
