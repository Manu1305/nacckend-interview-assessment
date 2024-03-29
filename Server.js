const express = require('express')
const cors = require('cors')
const app = express()
const Connectdb = require('./Database/Db')
const userRouter = require('./Router/User')

app.use(cors({
    origin: '*',
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter)
app.listen(3000, () => {
    console.log("Server is running on port 3000")
   
    Connectdb()
})

