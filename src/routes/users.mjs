import { query, validationResult, body, matchedData } from "express-validator";
//i saved my user array of objects in this file
import { mockUsers } from "../utils/constants.mjs";
// i saved my middlewares inside this file
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

// after having installed cors i import it here
//it helps when we want to send our api call to a frontend program.Otherwise
//i will have a blockage
import cors from "cors";

//import and create a router object START
import { Router } from "express";
const router = Router();
//import and create a router object END

//make cours a global middleware.
//after import i use the cors in this way
router.use(cors());

// MOVED MY VALIDATION MIDDLEWARE FRON INDEX TO HERE
//Creating a new middleware for the validations where i define which columns should
//be validated and how they should be validated
export const validationConditions = [
  body("name")
    .notEmpty()
    .withMessage("name cannot be empty")
    .isLength({ min: 5, max: 32 })
    .withMessage("name must be at least 5 to 32 char")
    .isString()
    .withMessage("name must be a string"),
  body("userName")
    .isLength({ min: 5, max: 32 })
    .withMessage("user name must be at least 5 to 32 char")
    .isString()
    .withMessage("name must be a string"),
];

//----------------GET START------------------------------------
//move what i put in the "app.get()" here in the router file
router.get(
  "/api/users",
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
        mockUsers.filter((user) => user[filter].includes(value))
      );
    } else {
      return response.send(mockUsers);
    }
  }
);

// create a ROUTE that uses ROUTE PARAMETERS to get a single element
router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  //checking if the id that i have is present in the database
  if (!findUser) {
    return response.sendStatus(404);
  } else {
    return response.send(findUser);
  }
});
//----------------GET END------------------------------------

//--------------POST REQUEST-----------------------------
//move what i put in the "app.post()" here in the router file
router.post("/api/users", validationConditions, (request, response) => {
  //added the "validationResult()" function
  const result = validationResult(request);
  //console.log(result);

  //while the validation above gives me the xtics i want,
  //this gives me more info about the error, pointing out
  //where it is located exactly. and it stops the creation of
  //any new entity
  if (!result.isEmpty()) {
    return response.status(400).send({ errors: result.array() });
  }

  //we save the new object when it passes the checks in the
  // "data" variable
  const data = matchedData(request);
  //console.log(data);
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
  mockUsers.push(newUser);
  return response.status(201).send(newUser);
});

//-----------PUT REQUEST--------------------------------------
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  //keep the id the same but change the body
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return response.sendStatus(200);
});

//------------PATCH REQUEST-----------------------------------
router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

//-------------DELETE REQUEST---------------------------------------------
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
