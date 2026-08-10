//run SQL and return rows.
import pool from "../database.js";
//import the shared postgresql connection pool from database.js
// pool is the name that we will refre to pool in this project
/*GOAL: 
 * Fetch teh menu items from the DB that belong to one specific company  
 * Now to access the specific data of a company we eed to have access to
 * comapnyId ----> provided my controller (a specific companies POS)
*/
// export async function name(params) { logic}
export async function GetItemByCompanyId(companyId) {
    // this function would help us to pass the query in the postgres database
    //we will only select the relevant data that we need
    // we have defined a query constant variable
// query for selecting the items that the company have
    const query=
    `SELECT
    id,name,price,type
    FROM items
    WHERE company_id = $1
    ORDER BY name ASC`;
// $1 is a placeholder — pool.query replaces it safely with companyId (prevents SQL injection) //ordering ascending order
// now the query works as a SPARK for the database to initiate the reponse
const result = await pool.query(query,[companyId])
//awaits -->pauses until POSTGRES ANSWERES
//pool.query (sql,[values]) replaces placeholder with id safely 8-)
//pool saves the sql row into JSON FORMAT
// i.e result.rows is an array of object (you can take it as a dictionary as well)
/*[{ id:1,
    name:"CHB",
    price:"12.00",
    type:"Full"},....]*/
    return result.rows; // returns the array of object
} 
/* AS now company has to make a sale,
for calculating a specific cart selected by one customer  we will

cartItem=[{item_id:1,quantity:2...}]
options={ taxRate, discountRate, extraCharge, paymentMethod } — decided by the user */

export async function CreateOrderForCompany(companyId,cartItems,options={}){
    // Read user-decided values; default to 0 / CASH if missing
    const taxRate=Number(options.taxRate)||0;         // percent
    const discountRate=Number(options.discountRate)||0; // percent
    const extraCharge=Number(options.extraCharge)||0;   // Rs add-on
    const paymentMethod=options.paymentMethod||"CASH";
    if (!Array.isArray(cartItems)|| cartItems.length===0){
        throw new Error("Cart is Empty!");
    }
    // if cart is empty we will get the error

    for (const line of cartItems){
        if(!line.item_id || !line.quantity || line.quantity<=0) {
            throw new Error("Invalid Cart Item!")
        }
    }
    // Check for valid IDS Items
    //Extract all item ids from the cart
    const itemIds=cartItems.map((line) => line.item_id);

    //$1  id in the query is replaced by itemIds array
    //$2 id in the query is replaced by companyId
    // IN regex $1 and $2 are used to replace the placeholders 
    // in the query with the actual values
    const itemQuery=`
    SELECT id,name,price,type
    FROM items
    WHERE id=ANY($1) 
    AND company_id=$2`;
    //query to find the items that are in the cart and belong to the company
    const itemsResult=await  pool.query(itemQuery,[itemIds,companyId]);
    //awaits the query to be executed and returns the result
    const database_items=itemsResult.rows;       
    //database_items is an array of objects
    // key value pairs= [{id:1,name:"CHB",price:"12.00",type:"Full"},....]

    if (database_items.length !== itemIds.length){
        throw new Error("Items not found or do not belong to the company!");
    }//If itemid=99 sent but it doesnt exist for the company, reject the order

    const itemMap={}; // create a map to store the items by their id
    for (const item of database_items){
        itemMap[item.id]=item;//set property

        // BUILDING A LOOKUP MAP {1:{id,name,price,type},2:{id,name,price,type}...}
    }
    
    // Calculate total price
    let subtotal=0;
    //building the order lines for the order
    const orderLines= cartItems.map((line)=>{
        const database_item=itemMap[line.item_id];//get verified item from the map
        const lineTotal=Number(database_item.price)*line.quantity;// price*quantity
        subtotal+=lineTotal;// add to running subtotal

        return{
            item_id:database_item.id,// accessing the id of the item from the database
            // name:database_item.name,
            // type:database_item.type,
            quantity:line.quantity, // quantity of the item
            price:Number(database_item.price),// price of one item -- converting the string to number
            line_total:lineTotal,// total price for the line item
        };
    });
    // Discount comes off the subtotal first
    const discountAmount=Number((subtotal*(discountRate/100)).toFixed(2));
    const taxableBase=subtotal-discountAmount;
    // Tax applies to the amount left after discount
    const tax=Number((taxableBase*(taxRate/100)).toFixed(2));
    // Add-on charge is added on top of everything
    const total=Number((taxableBase+tax+extraCharge).toFixed(2));

    // Saving the order and order lines to the database
    const client=await pool.connect();// get a client from the pool
    try{
        await client.query("BEGIN"); //Start a transaction
        // Order Insert Query — store the full money breakdown
        const orderInsertQuery=`
        INSERT INTO orders
        (company_id, subtotal, discount_rate, discount_amount, tax_rate, tax_amount, extra_charge, total, payment_method)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id`;
        const orderResult=await client.query(orderInsertQuery,[
            companyId, subtotal, discountRate, discountAmount,
            taxRate, tax, extraCharge, total, paymentMethod,
        ]);
        const orderId=orderResult.rows[0].id; 
        // get the order id from the result (newly created order 
        // automatically created by the database)


        for (const line of orderLines){
            await client.query(
                `INSERT INTO order_items(order_id, item_id, quantity) VALUES($1, $2,$3)`,
                [orderId,line.item_id,line.quantity])

                // .query(function,[values]) executes the query with the provided values
        }
        await client.query("COMMIT"); // Commit the transaction 
        //if all queries are successful, save changes to the database.
        return{
            order_id:orderId,
            subtotal,
            discount_rate:discountRate,
            discount_amount:discountAmount,
            tax_rate:taxRate,
            tax_amount:tax,
            extra_charge:extraCharge,
            total,
            payment_method:paymentMethod,
            order_lines:orderLines,
        };
    } 
    catch(error)
    {
        // If any query fails, rollback the transactions cause we dont want to save partial data ;]
        await client.query("ROLLBACK");
        throw error; // rethrow the error
    } finally
    {
        //Connecting to the database, storing the data, 
        //releasing the connection back to the pool for reuse.
        client.release();
    }
}
    



// in this file controllers( read,response to a request) are used to initiate the system
// This file is done:)