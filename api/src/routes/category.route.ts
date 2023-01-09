import {Router} from "express";
import CategoryController from "../controllers/category.controller";
import {checkJwt, checkRole} from "../middlewares/jwt.checkers";

const router = Router();
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getOne);
router.put("/", [checkJwt, checkRole(['admin'])], CategoryController.newCategory);
router.post("/:id", [checkJwt, checkRole(['admin'])], CategoryController.editCategory);
router.delete("/:id", [checkJwt, checkRole(['admin'])], CategoryController.deleteCategory);

export default router;