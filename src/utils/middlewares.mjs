//i saved my user array of objects in this file
import { mockUsers } from "./constants.mjs";

// local middleware 1
export const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const findUserIndex = mockUsers.findIndex(
    //user PREDICATE function
    (user) => user.id === parsedId
  );
  if (findUserIndex === -1) {
    return response.sendStatus(404);
  }
  //here i am passing findUserIndex so that it can be captured
  //by a potential next middleware or my the rest of the endpoint
  request.findUserIndex = findUserIndex;
  next();
};
