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
exports.signup = exports.signin = void 0;
const db_1 = require("../db");
const user_model_1 = require("../db/models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    try {
        yield (0, db_1.db)();
        const dbUser = yield user_model_1.User.findOne({ email: data.email });
        if (dbUser) {
            return res
                .status(400)
                .json({ message: "User already exists with the provided email" });
        }
        const hashedPassword = bcrypt_1.default.hashSync(data.password, 10);
        const user = yield user_model_1.User.create({
            username: data.email,
            email: data.email,
            password: hashedPassword,
        });
        if (!user) {
            return res.status(400).json({ message: "Unable to register you." });
        }
        return res.status(200).json({ success: true, message: "Account created" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong..." });
    }
});
exports.signup = signup;
//signin
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    try {
        yield (0, db_1.db)();
        const dbUser = yield user_model_1.User.findOne({ email: data.email });
        if (dbUser) {
            //compare password
            const dbUserPassword = dbUser.password;
            const compare = yield bcrypt_1.default.compare(data.password, dbUserPassword);
            if (compare) {
                const jwt_token = jsonwebtoken_1.default.sign({ userId: dbUser._id }, `${process.env.JWT_SECRET_SESSION}`);
                return res.status(200).json({ success: true, message: "Lohin success", username: dbUser.username, token: jwt_token });
            }
        }
        return res
            .status(400)
            .json({ message: "Not able to verify your identity, CHECK PASSWORD" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went worng.." });
    }
});
exports.signin = signin;
