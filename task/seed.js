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
    const fileContent = await fs.readFileAsync(__dirname + "/Recipes.json", "utf-8");
    const jsonObj = JSON.parse(fileContent);
    for (let i = 0; i < jsonObj.length; i++) {
        let record = jsonObj[i];
        let _id = record['_id'];
        let title = record['title'];
        let category = record['category'];
        let likes = record['likes'];
        let posterID = record['posterID'];
        let picture = record['picture'];
        let ingredients = record['ingredients'];
        let steps = record['steps'];
        let comment = record['comment'];

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
        recipes: recipes_temp
    };
    await recipes.createTop10Recipes(top10recipes);
    // fs.readFileAsync('../data/Recipes.json', async function (err, data) {
    //     if (err) throw err;
    //     let jsonObj = JSON.parse(data);
    //
    //     // for (let i = 0; i < jsonObj.length; i++) {
    //     //     let record = jsonObj[i];
    //     //     let _id = record['_id'];
    //     //     let title = record['title'];
    //     //     let category = record['category'];
    //     //     let likes = record['likes'];
    //     //     let posterID = record['posterID'];
    //     //     let picture = record['picture'];
    //     //     let ingredients = record['ingredients'];
    //     //     let steps = record['steps'];
    //     //     let comment = record['comment'];
    //     //
    //     //     const newRecipe = {
    //     //         _id : _id,
    //     //         title : title,
    //     //         category: category,
    //     //         likes : likes,
    //     //         posterID : posterID,
    //     //         picture : picture,
    //     //         ingredients : ingredients,
    //     //         steps : steps,
    //     //         comment : comment
    //     //     };
    //     //     const insert_recipe = await recipes.initRecipe(newRecipe);
    //     //     const single_recipe = {
    //     //         _id : insert_recipe[0]._id,
    //     //         title : insert_recipe[0].title,
    //     //         likes : insert_recipe[0].likes,
    //     //         picture : insert_recipe[0].picture
    //     //     };
    //     //     recipes_temp.push(single_recipe);
    //     // }
    //     //
    //     // const top10recipes = {
    //     //     _id : "Top10",
    //     //     recipes: recipes_temp
    //     // };
    //     // await recipes.createTop10Recipes(top10recipes);
    // });

    const newUser = {
        username: "test",
        password: "test",
        admin: true,
        profile : {
            nickname: "test_nickname",
        },
    };
    await users.createUser(newUser);

    await db.serverConfig.close();
    console.log("Seeding done");
}

main();
