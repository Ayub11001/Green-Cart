const asyncHandler = (taskHandler) => {
    return (req, res, next) => {
        Promise.resolve(taskHandler(req, res, next))
        .catch(error => next(error))
    }
}

export  {asyncHandler};