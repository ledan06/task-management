const express = require("express")
require("dotenv").config()
const bodyParser = require('body-parser')
const database = require("./config/database")
const cookieParser = require('cookie-parser')
const cors = require('cors')

const routesApiVer1 = require("./api/v1/routes/index.route")

database.connect()

const app = express()
const port = process.env.PORT

app.use(cors())

app.use(cookieParser());


// parse application/json
app.use(bodyParser.json())

// Routes Version 1
routesApiVer1(app)

app.listen(port, ()=> {
    console.log(`App listening on port ${port}`)
})