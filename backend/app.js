//Express is the web framework that handles HTTP
import express from "express"; 
// API testing 
import cors from "cors";

// Billing routes
import billingRoutes from "./modules/billing/billing.routes.js";

/* creates a basic node.js web server
uses the expres faramework to respond
with a status message when a specific
web address is visited*/

const app = express(); 
// creates the application , foundation (as the app 
//object(var) is used to configure routing, middle ware,server settings)

app.use(express.json());
// enables json parsing, hadles the incoming json data in the body of HTTP request
//converts into a readable JAVASCRIPT OBJECT

app.use(
  cors({
    //dev origin
    origin:"http://localhost:5173"
  })
);
// Simple health check 
// GET http://localhost:5000/api/v1/health
app.get("/api/v1/health",(req,res)=>{res.json(
  {
    ok  : true
  })
//sends the response, returns the data with a success code 200
});
// defines a route, for health check puropses, 
// callback function (request(info by the user),
// repsone(send data back to the user))=>{}

app.use("/api/v1/billing", billingRoutes);
// Mounting billing route under /api/v1/billing/items
// So router.get("/items") becomes GET /api/v1/billing/items

export default app;
//export app, server.js would call app.listen()