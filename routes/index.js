const userRoute = require("./users");
const recipeRoute = require("./recipes");
const categoryRoute = require("./categories");
const queueRoute = require("./queue");
const constructorMethod = (app) => {
    app.use("/", userRoute);
    app.use("/recipes", recipeRoute);
    app.use("/categories", categoryRoute);
    app.use("/queue", queueRoute);
    app.use("*", (req, res) => {
        res.status(404).json({error: "Route Not Found"});
    });
};
module.exports = constructorMethod;