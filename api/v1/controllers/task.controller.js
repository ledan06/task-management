const Task = require("../models/task.model")
const paginationHelpers = require("../../../helpers/pagination")
const searchHelpers = require("../../../helpers/search")
//[GET] /tasks/
module.exports.index = async (req, res) => {
    const find = {
        $or: [
            { createdBy: req.user.id },
            { listUser: req.user.id}
        ],
        deleted: false
    }
    if(req.query.status){
        find.status = req.query.status
    }

    //Search
    const objectSearch = searchHelpers(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }
    // End Search

    // Pagination
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelpers(
        {
            currentPage: 1,
            limitIteam: 2
        },
        req.query,
        countTasks
    )
    //End Pagination

    //Sort
    const sort ={}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }
    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitIteam)
    .skip(objectPagination.skip);
    // End Sort

    res.json(tasks)
}

//[GET] /tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id

        const task = await Task.findOne({
            _id: id,
            deleted: false
        })
        res.json(task)
    } catch (error) {
        res.json("Không tìm thấy")
    }
    
}

//[PATCH] /tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id
        const status = req.body.status

        await Task.updateOne({
            _id: id
        },{
            status: status
        }
    )
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        })
    } catch (error) {
        
        res.json({
            code: 400,
            message: "Không tồn tại!"
        })
    }
    
}

//[PATCH] /tasks/change-status/:id
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: {$in: ids}
                },{
                    status: value
                })
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                })
                break;
            case "delete":
                await Task.updateMany({
                    _id: {$in : ids }
                }, {
                    deleted: true,
                    deleteAt: new Date
                })
                res.json({
                    code: 200,
                    message: "Xóa thành công"
                })
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!"
                })
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        })
    }
    
}

//[GET] /api/v1/tasks/create
module.exports.createPost = async (req, res) => {
    try {
        req.body.createdBy = req.user.id
        const product = new Task(req.body)
        const data = await product.save()

        res.json({
            code: 200,
            message: "Tạo thành công",
            data: data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
    
}
//[GET] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        
        await Task.updateOne({ _id: id }, req.body)

        res.json({
            code: 200,
            message: "Cập nhật thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
    
}

//[GET] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        
        await Task.updateOne({ _id: id }, {
            deleted: true,
            deleteAt: new Date()
        })

        res.json({
            code: 200,
            message: "Xóa thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
    
}