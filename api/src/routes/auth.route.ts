import {Router} from "express";
import AuthController from "../controllers/auth.controller";

const router : Router = Router();
//Login route
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

router.delete("/logout", AuthController.logout);
// register

export default router;