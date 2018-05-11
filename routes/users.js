const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;
const recipes = data.recipes;
const categories = data.categories;
const queues = data.queue;
const ccap = require('ccap');
const xss = require('xss');

router.use(function(req,res,next){
    xss(req.body);
    next();
});
//homepage with or without user login
router.get("/", async (req,res)=>{
    const top10 = await recipes.getRecipeById("Top10");
    const category = await categories.getAllCategories();
    if(req.session.user){
        res.render("homepage", {login : true,
                                 user:req.session.user,
                                 recipe: top10[0].recipes,
                                 category : category});
    }
    else{
        res.render("homepage", {login : false,
                                recipe : top10[0].recipes,
                                category : category});
    }
});

//login page
router.get("/login",(req,res)=>{
    res.render("users/login");
});
//used to login any user
router.post("/login", async (req,res)=>{
    try {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const getUser = await users.getUserByName(username);
        if (username === getUser[0].username && password === getUser[0].password) {
            req.session.user = getUser[0];
            res.redirect("/");
        }
        else {
            res.render("users/login", {error: "wrong password!"});
        }
    }catch(e){
        res.render("users/login", {error: "wrong username!"})
    }
});

//used to logout
router.get("/logout", async(req,res)=>{
    delete req.session.user;
    res.redirect("/");
});

//private page
router.get("/private/:id", async(req,res)=>{
    const id = req.params.id;
    const getUser = await users.getUserById(id);
    const follows = getUser[0].profile.follows;
    const follows_cook = [];
    for (let i = 0; i < follows.length; i++) {
        let getUser = await users.getUserById(follows[i]);
        follows_cook.push(getUser[0]);
    }
    const favorite = getUser[0].profile.favorite;
    const favorite_recipes = [];
    for (let i = 0; i < favorite.length; i++) {
        let getRecipe = await recipes.getRecipeById(favorite[i]);
        favorite_recipes.push(getRecipe[0]);
    }
    const postlist = getUser[0].postlist;
    const post_recipes = [];
    for (let i = 0; i < postlist.length; i++) {
        let getRecipe = await recipes.getRecipeById(postlist[i]);
        post_recipes.push(getRecipe[0]);
    }
    const allQueues = await queues.getAllQueues();
    if (getUser[0].admin) {
        res.render("users/private",{user : req.session.user, admin : true, queue : allQueues});
    } else {
        res.render("users/private",{user : req.session.user, admin : false, post : post_recipes, favorite : favorite_recipes, follows : follows_cook});
    }
});

router.get("/public/:id", async(req,res)=>{
    const id = req.params.id;
    const getUser = await users.getUserById(id);
    const postlist = getUser[0].postlist;
    const post_recipes = [];
    for (let i = 0; i < postlist.length; i++) {
        let getRecipe = await recipes.getRecipeById(postlist[i]);
        post_recipes.push(getRecipe[0]);
    }
    res.render("users/public", {user : getUser[0], post : post_recipes});
});


router.get("/register", (req,res)=>{
    res.render("users/register");
});

router.post("/register", async(req,res)=>{
    let error = {};
    let error_flag = false;
    const user = req.body;
    if(!req.body.username){
        error.usernameerror = "username can't be empty!";
        error_flag = true;
    }
    if(!req.body.password){
        error.passworderror = "password can't be empty!";
        error_flag = true;
    }
    if(!req.body.nickname){
        error.nicknameerror = "nickname can't be empty!";
        error_flag = true;
    }
    user.admin = false;

    if(error_flag){
        res.render("users/register", {error_list: error});
    }
    else {
        const text = user.verify.toLowerCase();
        if (text !== req.session.verifycode) {
            res.render("users/register", {error: "Wrong verify code!"});
        }
        else {
            const getUserDatabase = await users.getUserByName(req.body.username);
            if (getUserDatabase.length !== 0) {
                res.render("users/register", {error: "User already exist!"});
            }
            else {
                const getUser = await users.createUser(user);
                req.session.user = getUser[0];
                res.redirect("/");
            }
        }
    }
});


router.get('/getCaptcha', (req,res)=>{
    let captcha = ccap();
    let ary = captcha.get();
    let text = ary[0];
    let buffer = ary[1];
    req.session.verifycode=text.toLowerCase();
    res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': buffer.length });
    res.end(buffer);
});

router.post('/search', async(req,res)=>{

    let keyword= req.body.search;
    const result = await recipes.getRecipeByKey(keyword);
    let login = false;
    if(req.session.user){
        login = true;
    }else {
        login = false;
    }
    res.render('users/search',{result : result, login: login, user:req.session.user});
});

module.exports = router;