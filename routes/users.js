const express = require("express");
const router = express.Router();

//homepage with or without user login
router.get("/",(req,res)=>{
    if(req.session.user){
        res.render("homepage", {login : true,
                                 user:req.session.user,
                                 recipe: Recipe});
    }
    else{
        res.render("homepage", {login : false,
                                recipe : Recipe});
    }
});

//login page
router.get("/login",(req,res)=>{
    res.render("users/login");
});
//used to login any user
router.post("/login", async (req,res)=>{
    const user = req.body;
    const username = user.username;
    const password = user.password;
    if(username === User.username && password === User.password){
        req.session.user = User;
        res.redirect("/");
    }
    else{
        res.render("users/login",{error:"wrong username or password"});
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
    res.render("users/private",{user : req.session.user, id : id});
});



const User = {
    id: "1",
    username : "test",
    password : "test"
};

const Recipe = {
    id : "2",
    title: "recipe1",
    category: "chuan",
    likes: 0,
};


module.exports = router;