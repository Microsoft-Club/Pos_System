//run SQL and return rows.
import pool from "../../database.js";
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
const query=
// we have defined a query constant variable
// query for selecting the items that the company have
`SELECT
id,name,price,type
 FROM items
 WHERE company_id= $1 // placeholder as we might get some sql injections if we were to use the string literals or +
 ORDER BY name ASC`; //ordering ascending order
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
// in this file controllers( read,response to a request) are used to initiate the system
// This file is done:)