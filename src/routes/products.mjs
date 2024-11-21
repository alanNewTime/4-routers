import { mockProducts } from "../utils/constants.mjs";
import { query, validationResult } from "express-validator";
import { Router } from "express";
const router = Router();

router.get(
  "/api/products",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must be at least 3-10 characters")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    //added the "validationResult()" function
    const result = validationResult(request);
    //console.log(result);
    //use QUERY PARAMETERS to filter through the users
    const {
      query: { filter, value },
    } = request;

    //when filter and value are defined it returns what i want filtered and how i want it filtered
    if (filter && value) {
      return response.send(
        mockProducts.filter((user) => user[filter].includes(value))
      );
    } else {
      return response.send(mockProducts);
    }
  }
);

export default router;
