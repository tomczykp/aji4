import { Router } from "express";
import UserController from "../controllers/user.controller";

const router : Router = Router();

//Get all users
router.get("/", UserController.getAll);

// Get one user
router.get("/:id", UserController.getOne);

//Create a new user
router.put("/", UserController.newUser);

//Edit one user
router.post("/:id", UserController.editUser);

//Delete one user
router.delete("/:id", UserController.deleteUser);

export default router;