import {Router} from "express";
import CategoryController from "../controllers/category.controller";

const router = Router();
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getOne);
router.put("/", CategoryController.newCategory);
router.post("/:id", CategoryController.editCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;