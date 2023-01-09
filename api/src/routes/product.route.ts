import {Router} from "express";
import ProductController from "../controllers/product.controller";
import {checkJwt, checkRole} from "../middlewares/jwt.checkers";

const router : Router  = Router();
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getOne);
router.put("/", [checkJwt, checkRole(['admin'])],ProductController.newProduct);
router.post("/:id", [checkJwt, checkRole(['admin'])],ProductController.editProduct);
router.delete("/:id", [checkJwt, checkRole(['admin'])],ProductController.deleteProduct);

export default router;