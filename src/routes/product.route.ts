import {Router} from "express";
import ProductManager from "../managers/product.manager";

const router : Router  = Router();
router.get("/", ProductManager.listAll);
router.get("/:id", ProductManager.getOneById);
router.put("/", ProductManager.newProduct);
router.post("/:id", ProductManager.editProduct);
router.delete("/:id", ProductManager.deleteProduct);

export default router;