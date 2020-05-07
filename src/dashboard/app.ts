import { dashboard } from "../utils/Config";
import CheckAuth from "./auth/CheckAuth";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import passport from "passport";
import { Strategy } from "passport-discord";
import utils from "./utils"

export function load(client) {

    const app = express()

    const mainRouter = require("./routes/index"),
    userRouter = require("./routes/user"),
    loginRouter = require("./routes/login"),
    settingsRouter = require("./routes/settings"),
    guildManagerRouter = require("./routes/guild-manager"),
    apiRouter = require("./routes/api"),
    commandsRouter = require("./routes/commands"),
    botStatsRouter = require("./routes/botstats"),
    levelsRouter = require("./routes/levels")

    app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .engine("html", require("ejs").renderFile)
    .set("view engine", "ejs")
    .use(express.static(path.join(__dirname, "/public")))
    .set('views', path.join(__dirname, "/views"))
    .set("port", dashboard.port)
    .use(session({ secret: dashboard.expressSessionPassword, resave: false, saveUninitialized: false }))
    .use(passport.initialize())
    .use(passport.session())
    .use(async function(req, res, next){
        req.client = client;
        if(req.user && req.url !== "/"){
            req.userInfos = await utils.fetchUser(req.user, req.client, req.query.q);
        }
        next();
    })
    .use("/login", loginRouter)
    .use("/manage", guildManagerRouter)
    .use("/settings", settingsRouter)
    .use("/user", userRouter)
    .use("/api", apiRouter)
    .use("/commands", commandsRouter)
    .use("/botstats", botStatsRouter)
    .use("/levels", levelsRouter)
    .use("/", mainRouter)

    .use(CheckAuth, function(req, res, next){
        res.status(404).render("404", {
            user: req.userInfos,
            currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`
        });
    })
    .use(CheckAuth, function(err, req, res, next) {
        console.error(err.stack);
        if(!req.user) return res.redirect("/");
        res.status(500).render("500", {
            user: req.userInfos,
            currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`
        });
    });

    app.listen(app.get("port"), (err) => {
        client.logger.info("Dashboard started on port "+app.get("port"));
    });

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    let disStrat = new Strategy({
        clientID:       client.user.id,
        clientSecret:   dashboard.secret,
        callbackURL:    dashboard.baseURL+"/login",
        scope:          [ "identify", "guilds" ]
    }, function (accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            return done(null, profile);
        });
    });

    passport.use(disStrat);

}