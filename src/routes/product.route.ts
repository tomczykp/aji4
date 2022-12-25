import {Router} from "express";
import ProductController from "../controllers/product.controller";

const router : Router  = Router();
router.get("/", ProductController.listAll);
router.get("/:id", ProductController.getOneById);
router.put("/", ProductController.newProduct);
router.post("/:id", ProductController.editProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;