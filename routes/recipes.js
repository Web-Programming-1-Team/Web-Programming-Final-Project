const express = require("express");
const router = express.Router();
const data = require("../data");
const recipes = data.recipes;
const users = data.users;
const categories = data.categories;
const multer  = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});
let upload = multer({
    storage: storage
});
let src_list = [];

router.get("/upload", async (req,res)=>{
    src_list = [];
    res.render("recipes/new-recipe");
});


router.post('/upload', upload.single('file'), function (req, res) {
    let url = 'http://' + req.headers.host + '/public/images/' + req.file.originalname;
    res.json({
        code : 200,
        data : url
    });
    const src = url;
    src_list.push(src);
});

router.post("/uploads",async(req,res)=>{

    const name = req.body.name;
    const amount = req.body.amount;
    const instruction = req.body.instruction;
    let ingredients = [];
    for(let i = 0; i < name.length; i++){
        const tempobj = {
            name : name[i],
            amount : amount[i]
        };
        ingredients.push(tempobj);
    }
    let steps = [];
    for(let i = 0; i < instruction.length; i++){
        const tempobj = {
            instruction : instruction[i],
            image : [{
                src: src_list[i + 1]
            }]
        };
        steps.push(tempobj);
    }

    let category_name = req.body.category;
    let getCategory = await categories.getCategoryByName(category_name);
    if(getCategory.length === 0){
        const category = {
            name : category_name,
        };
        await categories.createCategory(category);
    }
    getCategory = await categories.getCategoryByName(req.body.category);

    let newrecipe = {};
    newrecipe.title = req.body.title;
    newrecipe.category = getCategory[0]._id;
    newrecipe.posterID = req.session.user._id;
    newrecipe.picture = src_list[0];
    newrecipe.ingredients = ingredients;
    newrecipe.steps = steps;
    const create_result = await recipes.createRecipe(newrecipe);
    const posterID = req.session.user._id;
    const getUser = await users.getUserById(posterID);
    getUser[0].postlist.push(create_result[0]._id);
    await users.updateUser(posterID,getUser[0]);
    getCategory[0].recipes.push(create_result[0]._id);
    await categories.updateCategory(getCategory[0]._id, getCategory[0]);
    res.render('recipes/recipe-content',{recipe : create_result[0]});
});

router.get("/:id", async(req,res)=>{
    const id = req.params.id;
    const getRecipe = await recipes.getRecipeById(id);
    const getPoster = await users.getUserById(getRecipe[0].posterID);
    getRecipe[0].posterName = getPoster[0].profile.nickname;
    let if_favorite = false;
    if(req.session.users !== undefined) {
        const userid = req.session.user._id;
        const getUser = await users.getUserById(userid);
        for (let i = 0; i < getUser[0].profile.favorite.length; i++) {
            if (id === getUser[0].profile.favorite[i]) {
                if_favorite = true;
                break;
            }
        }
    }
    let login = false;
    if(req.session.user){
        login = true;
    }else {
        login = false;
    }
    if (if_favorite) {
        res.render("recipes/recipe-content", {recipe: getRecipe[0], id: id, login: login, user:req.session.user, like: true});
    } else {
        res.render("recipes/recipe-content", {recipe: getRecipe[0], id: id, login: login, user:req.session.user, like: false});
    }
});

router.post("/:id/comment", async(req,res)=>{
    let exist = true;
    if(req.session.users === undefined){
        exist = false;
    }
    if(exist) {
        const id = req.params.id;
        const userid = req.session.user._id;
        const username = req.session.user.username;
        const nickname = req.session.user.profile.nickname;
        const comment = req.body.comment;
        const newcomment = {
            _id: userid,
            poster: {
                _id: userid,
                nickname: nickname,
            },
            content: comment
        };
        const curRecipe = await recipes.getRecipeById(id);
        curRecipe[0].comment.push(newcomment);
        await recipes.updateRecipe(id, curRecipe[0]);
        res.redirect(`/recipes/${id}`);
    }else{
        res.json({
            code: 200,
            exist: exist
        });
    }
});

router.post("/:id", async(req,res)=>{
    let exist = true;
    if(req.session.user === undefined){
        exist = false;
    }
    if(exist) {
        const status = req.body.status;
        if (status === 'like') {
            const id = req.params.id;
            const curRecipe = await recipes.getRecipeById(id);
            curRecipe[0].likes = (parseInt(curRecipe[0].likes) + 1).toString();
            await recipes.updateRecipe(id, curRecipe[0]);
            await recipes.updateTop10(id);
            const userid = req.session.user._id;
            const curUser = await users.getUserById(userid);
            if_favorite = false;
            for (let i = 0; i < curUser[0].profile.favorite.length; i++) {
                if (id === curUser[0].profile.favorite[i]) {
                    if_favorite = true;
                    break;
                }
            }
            if (!if_favorite) {
                curUser[0].profile.favorite.push(id);
            }
            await users.updateUser(userid, curUser[0]);
        } else if (status === 'unlike') {
            const id = req.params.id;
            const curRecipe = await recipes.getRecipeById(id);
            curRecipe[0].likes = (parseInt(curRecipe[0].likes) - 1).toString();
            await recipes.updateRecipe(id, curRecipe[0]);
            await recipes.updateTop10(id);
            const userid = req.session.user._id;
            const curUser = await users.getUserById(userid);
            const favorite = [];
            for (let i = 0; i < curUser[0].profile.favorite.length; i++) {
                if (curUser[0].profile.favorite[i] !== id) {
                    favorite.push(curUser[0].profile.favorite[i]);
                }
            }
            curUser[0].profile.favorite = favorite;
            await users.updateUser(userid, curUser[0]);
        } else {
        }
    }
    res.json({
        code:200,
        exist:exist
    });

});

router.get("/category", async(req, res)=>{

});

module.exports = router;