"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../utils/Config");
const CheckAuth_1 = __importDefault(require("./auth/CheckAuth"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const passport_discord_1 = require("passport-discord");
const utils_1 = __importDefault(require("./utils"));
function load(client) {
    const app = express_1.default();
    const mainRouter = require("./routes/index"), userRouter = require("./routes/user"), loginRouter = require("./routes/login"), settingsRouter = require("./routes/settings"), guildManagerRouter = require("./routes/guild-manager"), commandsRouter = require("./routes/commands"), botStatsRouter = require("./routes/botstats"), levelsRouter = require("./routes/levels"), logoutRouter = require("./routes/logout");
    app
        .use(body_parser_1.default.json())
        .use(body_parser_1.default.urlencoded({ extended: true }))
        .engine("html", require("ejs").renderFile)
        .set("view engine", "ejs")
        .use(express_1.default.static(path_1.default.join(__dirname, "/public")))
        .set('views', path_1.default.join(__dirname, "/views"))
        .set("port", Config_1.dashboard.port)
        .use(express_session_1.default({ secret: Config_1.dashboard.expressSessionPassword, resave: false, saveUninitialized: false }))
        .use(passport_1.default.initialize())
        .use(passport_1.default.session())
        .use(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.client = client;
            if (req.user && req.url !== "/") {
                req.userInfos = yield utils_1.default.fetchUser(req.user, req.client, req.query.q);
            }
            next();
        });
    })
        .use("/login", loginRouter)
        .use("/manage", guildManagerRouter)
        .use("/settings", settingsRouter)
        .use("/user", userRouter)
        .use("/commands", commandsRouter)
        .use("/botstats", botStatsRouter)
        .use("/levels", levelsRouter)
        .use("/logout", logoutRouter)
        .use("/", mainRouter)
        .use(CheckAuth_1.default, function (req, res, next) {
        res.status(404).render("404", {
            user: req.userInfos,
            currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`
        });
    })
        .use(CheckAuth_1.default, function (err, req, res, next) {
        console.error(err.stack);
        if (!req.user)
            return res.redirect("/");
        res.status(500).render("500", {
            user: req.userInfos,
            currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`
        });
    });
    app.listen(app.get("port"), (err) => {
        client.logger.info("Dashboard started on port " + app.get("port"));
    });
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    passport_1.default.deserializeUser((obj, done) => {
        done(null, obj);
    });
    let disStrat = new passport_discord_1.Strategy({
        clientID: client.user.id,
        clientSecret: Config_1.dashboard.secret,
        callbackURL: Config_1.dashboard.baseURL + "/login",
        scope: ["identify", "guilds"]
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    });
    passport_1.default.use(disStrat);
}
exports.load = load;
