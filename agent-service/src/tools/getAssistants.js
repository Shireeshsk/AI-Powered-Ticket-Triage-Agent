export const getAssistants = async ()=>{
    try{
        const response = await fetch('http://localhost:5000/api/assistant/get')
        if(response.status==200){
            const data = await response.json()
            return data.assistants
        }
        return "Failed to Fetch Data"
    }catch(err){
        console.log(err)
        return "Failed to Fetch Data"
    }
}