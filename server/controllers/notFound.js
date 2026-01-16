const notFound = async (req, res, next) => {

    try {
        res.status(404).json({code : 404, success: false, message : "Client Error"})
    } catch (error) {
        next(error)
    }

}

module.exports = {notFound}