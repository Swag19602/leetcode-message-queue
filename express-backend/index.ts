import express from 'express'
import { createClient } from 'redis'


const app = express()
app.use(express.json())

const client = createClient()
client.on('error',(err)=>console.log("Redis Client Error",err))


app.post('/submit',async(req,res)=>{
    const problemId = req.body.problemId
    const code = req.body.code
    const language = req.body.language
    try{
        await client.lPush('problems',JSON.stringify({code,language,problemId}))
        //now to store in database
        res.status(200).send("Submission received and stored")
    }catch(error){
        console.log(error)
        res.status(500).send("Failed to store submission")
    }
})
async function startServer() {
    try{
        await client.connect()
        console.log("Connected to Redis")
        app.listen(3000,()=>{
            console.log("Server running on port 3000")
        })
    }
    catch(err){
        console.log("Failed to connect to Redis",err)
    }
    
}
startServer()