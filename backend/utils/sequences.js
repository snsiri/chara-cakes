//const { MongoClient } = require("mongodb");
import Counter from "../models/Counter.js";



// id with prefix e.g., CUS-0000000001 (10 numbers)
async function getNextSequenceValues(prefix, sequenceName) {
    try {
      
       
        const sequenceDocument = await Counter.findByIdAndUpdate(
            { _id: sequenceName },
            { $inc: { sequence_value: 1 } },
            {new: true, upsert: true},
            { returnDocument: "after", upsert: true }
        );
        console.log("Counter result:", sequenceDocument); // Debugging: Log the result

        if (!sequenceDocument) {
            throw new Error(`Counter document with _id: ${sequenceName} not found`);
        }


        return `${prefix}${sequenceDocument.sequence_value.toString().padStart(10, "0")}`; 


    } catch (error) {
        console.error("Error getting next sequence value:", error);
        throw error;
    }
}


export default getNextSequenceValues;