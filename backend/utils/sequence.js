// backend/utils/sequence.js
import Counter from '../models/Counter.js';
// id with prefix e.g., OPT-0001 (4 numbers)
async function getNextSequenceValue(prefix, sequenceName) {
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


        return `${prefix}${sequenceDocument.sequence_value.toString().padStart(4, "0")}`; 


    } catch (error) {
        console.error("Error getting next sequence value:", error);
        throw error;
    }
}



export default getNextSequenceValue;