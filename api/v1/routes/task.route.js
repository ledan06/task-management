const express = require('express')
const router = express.Router()

const checkStatusMiddleware = require("../../../middlewares/checkstatus.middleware")

const controller = require("../controllers/task.controller")


router.get('/', controller.index)

router.get('/detail/:id', controller.detail)

router.patch('/change-status/:id',checkStatusMiddleware.listStatus, controller.changeStatus)

router.patch('/change-multi',checkStatusMiddleware.listStatusChangeMulti, controller.changeMulti)

router.post("/create", controller.createPost)

router.patch("/edit/:id",checkStatusMiddleware.listStatus, controller.edit)

router.delete("/delete/:id", controller.delete)

module.exports = router;