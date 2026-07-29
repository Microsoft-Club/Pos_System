// routing i.e. connecting HTTP method and path to make the controller function
import { Router } from "express";

// Router lets us group the related routes in one file
import { listItems } from "./billing.controller";


//we will import the controller function for this route
// created a constant variable  for to create a mini-app router for billing endpoints
const router=Router(); 

// when someone sends GET request to get items of a specific company
// full path -- mounted on app.js
router.get("/items",listItems)

// export so app.js can import and mount this router
export default router;