const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const tasks = require("./router/Tasks")

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use("/tasks", tasks)

app.get("/", (req, res) => {
    res.json({message: "Hola desde el backend"})
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})