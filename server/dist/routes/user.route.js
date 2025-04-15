"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.post("/user/signin", user_controller_1.signin);
router.post("/user/signup", user_controller_1.signup);
exports.default = router;
