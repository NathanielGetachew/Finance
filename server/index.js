require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const connection = require("./db")


const { errorHandler } = require("./handler/errorHandler")
const reportRouter = require("./routes/reportRouter.js")
const usersRouter = require("./routes/userRouter.js")
const depositRouter = require("./routes/depositRouter.js")






// data base connection
connection()

// middlewares
app.use(express.json())
app.use(cors())


// routes 
app.use("/api/users",usersRouter)
app.use("/api/deposits",depositRouter)
app.use("/api/reports",reportRouter)

// error handler
app.use(errorHandler);

const port = process.env.PORT || 8080
app.listen(port, ()=>console.log(`listening on port ${port}....`))