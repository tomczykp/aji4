import {Router} from "express";
import ProductController from "../controllers/product.controller";
import {checkJwt} from "../middlewares/jwt.checkers";

const router : Router  = Router();
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getOne);
router.put("/", [checkJwt],ProductController.newProduct);
router.post("/:id", [checkJwt],ProductController.editProduct);
router.delete("/:id", [checkJwt],ProductController.deleteProduct);

export default router;