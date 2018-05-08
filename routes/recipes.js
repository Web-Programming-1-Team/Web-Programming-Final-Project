const express = require("express");
const router = express.Router();

router.get("/:id", async(req,res)=>{
    const id = req.params.id;
    res.render("recipes/recipe-content",{recipe : Recipe, id : id});
});





const Recipe = {
    id : "2",
    title: "recipe1",
    category: "chuan",
    likes: 0,
};
module.exports = router;