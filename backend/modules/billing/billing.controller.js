/* 
>>>READS THE REQUEST 
>>> RESPONDS TEH REQUEST 
>>> CALLS THE SPECIFICSERVICE BEING CALLED
>>>SEND JSON OR THE ERRPOS ENCOUNTERRED
*/
import { GetItemByCompanyId,CreateOrderForCompany} from "./billing.service.js";
// we are just importing the functio that is talking to the database 
/*
* As We might be GET-ting the response i.e /api/v1/building/items
* There could be 3 things that teh controller function would do i.e
*Express always gives as 
*req->incoming requests from the user,query,body
*res->object use to send the response
*next-> pass errors
*/
//  list items is going to lists the items after retriving tem from postgresql
export async function listItems(req,res) {
    // now we may call the getitemfunction but we have to validate the data retreived
    //so we are going to validate using try catch 
    try{
    // so the server/user wants to have access to the company id for that we will just declare a company id variable to store the requested id
    const companyId=1; // hardcoded value else 
    // const companyId=req.user.company_id
    
    // Call the service ad wait for the array of items
    const items=await GetItemByCompanyId(companyId);

    //200 :OK . meaning send json (server is working) to the frontend to parse
    // We will gte some Item data  from the DATABASE we are goig to save that data to ealiy route taht onto our FRONTEND
    return res.status(200).json(
        { items:items,}
    );
    }
    catch(error){
        // we will log error as well 
        console.error("list Item error:",error);
        // 500 -> server error 
        return res.status(500).json(
            {
                message:"Failed to fetch the menu items",
            }
        );
    }
}



export async function createOrder(req,res){


    try{
        // const companyId=req.user.company_id;
        const companyId=1; // cause we hardcoded the value of company id

        // Read cart from the request body
        const {items,payment_method}=req.body;
        //Validate the cart and payment method
        if(!items || !Array.isArray(items) || items.length===0){
            return res.status(400).json({message:"Cart is empty or invalid"});
        }


        // Now we will call the service function to create the order
        const result=await CreateOrderForCompany(companyId,items);
        // Return the result to the client
        return res.status(201).json({
            order_id:result.order_id,
            subtotal:result.subtotal,
            tax:result.tax,
            total:result.total,
            payment_method:payment_method|| "CASH",
            items:result.order_lines,
        });
        //201-> created successfully
    }
    catch(error){
        console.error("create order error:",error);
        // Match the exact messages thrown by the service
        if (
            error.message === "Cart is Empty!" ||
            error.message === "Invalid Cart Item!" ||
            error.message === "Items not found or do not belong to the company!"
        ) {
            return res.status(400).json({ message: error.message }); // 400 = bad request
        }
        return res.status(500).json({ message: "Failed to create order" }); // 500 = server error
    }
}
