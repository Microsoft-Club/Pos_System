// routing i.e. connecting HTTP method and path to make the controller function
import { Router } from "express";

// Router lets us group the related routes in one file
import { listItems,createOrder } from "./billing.controller.js";


//we will import the controller function for this route
// created a constant variable  for to create a mini-app router for billing endpoints
const router=Router(); 

// when someone sends GET request to get items of a specific company
// full path -- mounted on app.js
router.get("/items",listItems);

//POST request for adding orders i.e POST /api/v1/billing/order
//Process: When someone sends POST to "/orders" then 
//we will simulatenouly createOrder function
router.post("/orders",createOrder);

// export so app.js can import and mount this router
export default router;