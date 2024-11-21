//importing the users file in the router folder
import usersRouter from "./users.mjs";
//importing the products file in the router folder
import productsRouter from "./products.mjs";

import { Router } from "express";
const router = Router();

router.use(usersRouter); //needed to connect with the users entity in the  routes folder
router.use(productsRouter); //needed to connect with the products entity in the routes folder

export default router;
