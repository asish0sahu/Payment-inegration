import connectToMongo from "./database/db.js";
import express from "express";
import cors from "cors";
import payment from "./routes/payment.js";

connectToMongo();
const app = express();
const PORT = 8000;


//middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('New Api looking good')
})

app.use('/api/payment', payment)

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

