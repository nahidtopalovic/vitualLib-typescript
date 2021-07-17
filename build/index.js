"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const seed_1 = require("./database/seed");
dotenv_1.default.config();
const app = express_1.default();
app.use(express_1.default.json());
app.use(morgan_1.default('combined'));
app.use(routes_1.default);
// Seed the database
void seed_1.seedDatabase();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
