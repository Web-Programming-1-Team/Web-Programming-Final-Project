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

router.post("/uploads",function(req,res){
    res.redirect('/');
});

router.get("/:id", async(req,res)=>{
    const id = req.params.id;
    const getRecipe = await recipes.getRecipeById(id);
    res.render("recipes/recipe-content",{recipe : getRecipe[0], id : id});
});

module.exports = router;