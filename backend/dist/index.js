"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Environment variables
const PORT = process.env.PORT || 3000;
// Local imports
const restaurant_router_1 = __importDefault(require("./routers/restaurant.router"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
// Initializing the express appl
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// Routers
app.use("/api/v1/auth", auth_router_1.default);
app.use("/api/v1/restaurants", restaurant_router_1.default);
app.use("/api/v1/users", user_router_1.default);
// Running the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
