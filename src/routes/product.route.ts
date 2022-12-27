import {Router} from "express";
import ProductController from "../controllers/product.controller";

const router : Router  = Router();
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getOne);
router.put("/", ProductController.newProduct);
router.post("/:id", ProductController.editProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;