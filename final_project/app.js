const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(session(
    {
        secret:'session-secret',
        name:'UserCookie',
        cookie:{
            maxAge:90000
        },
        resave:true,
        saveUninitialized:true
    }
));


configRoutes(app);
app.listen(3000, () => {
    console.log("Your routes will be running on http://localhost:3000");
});

