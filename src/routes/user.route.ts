import { Router } from "express";
import UserManager from "../managers/user.manager";

const router = Router();

//Get all users
router.get("/", UserManager.listAll);

// Get one user
router.get("/:id", UserManager.getOneById);

//Create a new user
router.put("/", UserManager.newUser);

//Edit one user
router.post("/:id", UserManager.editUser);

//Delete one user
router.delete("/:id", UserManager.deleteUser);

export default router;