"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const csurf_1 = __importDefault(require("csurf"));
const chalk_1 = __importDefault(require("chalk"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const database_1 = __importDefault(require("./src/config/database"));
const user_1 = __importDefault(require("./src/models/user"));
const admin_1 = __importDefault(require("./src/routes/admin"));
const shop_1 = __importDefault(require("./src/routes/shop"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const settings_1 = require("./settings");
// Configure environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = settings_1.Settings.PORT;
// Initialize MongoDB store for sessions
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI || '',
    collection: 'sessions',
});
// Catch store related errors
store.on('error', (error) => console.error(chalk_1.default.redBright(`Error in store: ${error}`)));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || '',
    cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: 'lax' },
    resave: false,
    saveUninitialized: false,
    store,
}));
const csrfProtection = (0, csurf_1.default)({ cookie: true });
// ✅ CORS Setup (for frontend communication)
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'CSRF-TOKEN'],
}));
app.use(csrfProtection);
app.use((0, connect_flash_1.default)());
app.use((req, res, next) => {
    if (!req.session.user)
        return next();
    if (!req.user) {
        user_1.default.findById(req.session.user._id)
            .then((user) => {
            req.user = user;
            next();
        })
            .catch((e) => console.error(chalk_1.default.redBright(`Error in user save: ${e}`)));
    }
    else {
        next();
    }
});
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken ? req.csrfToken() : null });
});
app.use((req, res, next) => {
    //get it on all pages - every rendered view
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
    next();
});
// ✅ API Routes
app.use('/admin', admin_1.default);
app.use('/', shop_1.default);
app.use(auth_1.default);
// ✅ Serve React Frontend
const clientBuildPath = path_1.default.resolve(__dirname, '../client/build');
app.use(express_1.default.static(clientBuildPath));
// Catch-all to serve React app for unknown routes
app.get('*', (req, res) => res.sendFile(path_1.default.join(clientBuildPath, 'index.html')));
// ✅ Connect to Database and Start Server
(0, database_1.default)(() => {
    console.info(chalk_1.default.blueBright(`🔋 Connected to Mongoose 🔋`));
    app.listen(PORT, () => {
        console.info(chalk_1.default.cyanBright(`📡 Server running on http://localhost:${PORT} 📡`));
    });
}).catch((e) => console.error(chalk_1.default.redBright(`Error in connecting to the server: ${e}`)));
