
module.exports.listStatus = async (req, res, next) => {
    const listStatus = ['initial', 'doing', 'pending', 'finish', 'nofinish'];

    const { status } = req.body;

    if (!listStatus.includes(status)) {
        return res.json({
            code: 404,
            message: "Lỗi!"
        })
    }

    if (!listStatus.includes(req.body.status)) {
        return res.json({
            code: 404,
            message: "Lỗi!"
        })
    }

    next();
}

module.exports.listStatusChangeMulti = async (req, res, next) => {
    const listStatus = ['initial', 'doing', 'pending', 'finish', 'nofinish'];
    if(req.body.value){
        if (!listStatus.includes(req.body.value)) {
            return res.json({
                code: 404,
                message: "Lỗi!"
            })
        }
    }
    


    next();
}