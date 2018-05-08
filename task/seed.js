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
    const newRecipe = {
        title : "recipe1",
        category: "chuan",
        likes : 0,
        posterID : "admin",
        ingredients : [],
        steps : [],
        comment : []
    };
    const insert_recipe = await recipes.createRecipe(newRecipe);

    const top10recipes = {
        _id : "Top10",
        recipes: [
            {
                _id : insert_recipe._id,
                title : insert_recipe.title,
                likes : insert_recipe.likes
            }
            ]
    };
    await recipes.createTop10Recipes(top10recipes);


    await db.serverConfig.close();
    console.log("Seeding done");
}

main();
