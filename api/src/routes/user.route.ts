import { Router } from "express";
import UserController from "../controllers/user.controller";
import {checkJwt} from "../middlewares/jwt.checkers";

const router : Router = Router();

//Get all users
router.get("/", UserController.getAll);

// Get one user
router.get("/:id", UserController.getOne);

//Create a new user
router.put("/",[checkJwt], UserController.newUser);

//Edit one user
router.post("/:id",[checkJwt], UserController.editUser);

//Delete one user
router.delete("/:id",[checkJwt], UserController.deleteUser);

export default router;