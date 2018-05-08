const userRoute = require("./users");
const recipeRoute = require("./recipes");
const constructorMethod = (app) => {
    app.use("/", userRoute);
    app.use("/recipes", recipeRoute);
    app.use("*", (req, res) => {
        res.status(404).json({error: "Route Not Found"});
    });
};
module.exports = constructorMethod;