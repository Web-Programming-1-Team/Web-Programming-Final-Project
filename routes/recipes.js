const express = require("express");
const router = express.Router();
const data = require("../data");
const recipes = data.recipes;
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


    let newrecipe = {};
    newrecipe.title = req.body.title;
    newrecipe.category = req.body.category;
    newrecipe.posterID = req.session.user._id;
    newrecipe.picture = src_list[0];
    newrecipe.ingredients = ingredients;
    newrecipe.steps = steps;
    const create_result = await recipes.createRecipe(newrecipe);
    res.render('recipes/recipe-content',{recipe : create_result[0]});
});

router.get("/:id", async(req,res)=>{
    const id = req.params.id;
    const getRecipe = await recipes.getRecipeById(id);
    console.log(getRecipe[0]);
    res.render("recipes/recipe-content",{recipe : getRecipe[0], id:id});
});

router.post("/:id", async(req,res)=>{
    const id = req.params.id;
    const userid = req.session.user._id;
    const username = req.session.user.username;
    const nickname = req.session.user.profile.nickname;
    const comment = req.body.comment;
    const newcomment = {
        _id:userid,
      poster:{
          _id:userid,
          nickname:nickname,
      },
      content:comment
    };
    const curRecipe = await recipes.getRecipeById(id);
    curRecipe[0].comment.push(newcomment);
    console.log(curRecipe[0].comment);
    await recipes.updateRecipe(id,curRecipe[0]);
    res.redirect(`/recipes/${id}`);
});

module.exports = router;