const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const recipes = data.recipes;

async function main() {
    const db = await dbConnection();
    const exist_users = await db.collection("users");
    const exist_recipes = await db.collection("recipes");
    if(exist_users)
        db.dropCollection("users");
    if(exist_recipes)
        db.dropCollection("recipes");

    const newUser = {
        username: "test",
        password: "test",
        admin: true,
        profile : {
            nickname: "test_nickname",
        },
    };
    await users.createUser(newUser);
    let recipestmp = [];

        tmptitle = `recipe1`;
        const newRecipe = {
            title: tmptitle,
            category: "chuan",
            likes: 0,
            posterID: "admin",
            ingredients: [],
            steps: [],
            comment: [],
            src: "http://localhost:3000/public/images/vim-cheat-sheet-diagram.png"
        };
        const insert_recipe = await recipes.createRecipe(newRecipe);
        const singlerecipe = {
            _id : insert_recipe[0]._id,
            title : insert_recipe[0].title,
            likes : insert_recipe[0].likes,
            src:insert_recipe[0].src
        };
        recipestmp.push(singlerecipe);

    const top10recipes = {
        _id : "Top10",
        recipes: recipestmp
    };
    await recipes.createTop10Recipes(top10recipes);


    await db.serverConfig.close();
    console.log("Seeding done");
}

main();
