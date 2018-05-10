const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const recipes = data.recipes;
const bluebird = require("bluebird");
const fs = bluebird.promisifyAll(require("fs"));

async function main() {
    const db = await dbConnection();
    const exist_users = await db.collection("users");
    const exist_recipes = await db.collection("recipes");
    if(exist_users)
        db.dropCollection("users");
    if(exist_recipes)
        db.dropCollection("recipes");

    const recipes_temp = [];
    const fileRecipe = await fs.readFileAsync(__dirname + "/Recipes.json", "utf-8");
    const jsonObj = JSON.parse(fileRecipe);
    let min_id;
    let min_like = 9999;
    for (let i = 0; i < jsonObj.length; i++) {
        let record = jsonObj[i];
        let _id = record['_id'];
        let title = record['title'].toLowerCase();
        let category = record['category'];
        let likes = parseInt(record['likes']);
        let posterID = record['posterID'];
        let picture = record['picture'];
        let ingredients = record['ingredients'];
        let steps = record['steps'];
        let comment = record['comment'];
        if(likes < min_like){
            min_like = likes;
            min_id = _id;
        }

        const newRecipe = {
            _id : _id,
            title : title,
            category: category,
            likes : likes,
            posterID : posterID,
            picture : picture,
            ingredients : ingredients,
            steps : steps,
            comment : comment
        };
        const insert_recipe = await recipes.initRecipe(newRecipe);
        const single_recipe = {
            _id : insert_recipe[0]._id,
            title : insert_recipe[0].title,
            likes : insert_recipe[0].likes,
            picture : insert_recipe[0].picture
        };
        recipes_temp.push(single_recipe);
    }
    const top10recipes = {
        _id : "Top10",
        recipes: recipes_temp,
        minimum: {
            _id : min_id,
            likes: min_like
        }
    };
    await recipes.createTop10Recipes(top10recipes);

    const fileUser = await fs.readFileAsync(__dirname + "/Users.json", "utf-8");
    const jsonBoj2 =JSON.parse(fileUser);
    for (let i = 0; i < jsonBoj2.length; i++) {
        let record = jsonBoj2[i];
        let _id = record['_id'];
        let username = record['username'];
        let password = record['password'];
        let admin = record['admin'];
        let profile = record['profile'];
        let postlist = record['postlist'];
        const newUser = {
            _id : _id,
            username : username,
            password : password,
            admin : admin,
            profile : profile,
            postlist : postlist
        };
        await users.initUser(newUser);
    }

    await db.serverConfig.close();
    console.log("Seeding done");
}

main();
