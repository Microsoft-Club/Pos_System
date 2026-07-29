/* 
>>>READS THE REQUEST 
>>> RESPONDS TEH REQUEST 
>>> CALLS THE SPECIFICSERVICE BEING CALLED
>>>SEND JSON OR THE ERRPOS ENCOUNTERRED
*/
import { GetItemByCompanyId } from "./billing.service";
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
                message:"Failed to fetch teh menu items",
            }
        );
    }
}