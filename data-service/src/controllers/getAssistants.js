import { Assistant } from "../models/Assistant.js";
export const getAssistants = async (req,res)=>{
    try{
        const data = await Assistant.find();
        // console.log(data)
        return res.status(200).json({
            success : true,
            message : "Assistants Fetched Successfully",
            assistants : data
        }) 
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : true,
            message : 'Internal Server Error'
        })
    }
}