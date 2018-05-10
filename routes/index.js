const userRoute = require("./users");
const recipeRoute = require("./recipes");
const categoryRoute = require("./categories");
const constructorMethod = (app) => {
    app.use("/", userRoute);
    app.use("/recipes", recipeRoute);
    app.use("/categories", categoryRoute);
    app.use("*", (req, res) => {
        res.status(404).json({error: "Route Not Found"});
    });
};
module.exports = constructorMethod;