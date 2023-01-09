import {Router} from "express";
import CategoryController from "../controllers/category.controller";
import {checkJwt, checkRole} from "../middlewares/jwt.checkers";

const router = Router();
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getOne);
router.put("/", [checkJwt], CategoryController.newCategory);
router.post("/:id", [checkJwt], CategoryController.editCategory);
router.delete("/:id", [checkJwt], CategoryController.deleteCategory);

export default router;