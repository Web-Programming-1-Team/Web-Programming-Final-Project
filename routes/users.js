const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;
const recipes = data.recipes;
const ccap = require('ccap');
//homepage with or without user login
router.get("/", async (req,res)=>{
    const top10 = await recipes.getRecipeById("Top10");
    if(req.session.user){
        res.render("homepage", {login : true,
                                 user:req.session.user,
                                 recipe: top10[0].recipes});
    }
    else{
        res.render("homepage", {login : false,
                                recipe : top10[0].recipes});
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
    res.render("users/private",{user : req.session.user, id : id});
});

router.get("/register", (req,res)=>{
    res.render("users/register");
});

router.post("/register", async(req,res)=>{
    const user = req.body;
    user.admin = false;
    const text = user.verify;
    while(text !== req.session.verifycode){
        res.redirect("/register");
    }
    const getUser = await users.createUser(user);
    req.session.user = getUser[0];
    res.redirect("/");
});


router.get('/getCaptcha', (req,res)=>{
    var captcha = ccap();
    var ary = captcha.get();
    var text = ary[0];
    var buffer = ary[1];
    req.session.verifycode=text.toLowerCase();
    res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': buffer.length });
    res.end(buffer);
});

router.post('/search', async(req,res)=>{
    let keyword= req.body.search;
    const result = await recipes.getRecipeByKey(keyword);
    res.render('users/search',{result : result});
});

module.exports = router;