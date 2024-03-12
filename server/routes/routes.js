const { Router } = require('express')
const { createRoom, getRooms } = require("../controllers/roomController")
const routes = Router()

routes.post('/rooms', createRoom)
routes.get('/rooms', getRooms)

module.exports = routes