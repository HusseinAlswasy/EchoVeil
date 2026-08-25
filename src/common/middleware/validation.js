
export const validation = (schema) => {
    return async (req, res, next) => {

        let errorList = []
        for (const key of Object.keys(schema)) {
            const { error } = schema[key].validate(req[key], { abortEarly: false }); // abortEarly to wait all error and fetch all 

            if (error) {
                error.details.forEach(element => {
                    errorList.push({
                        key,
                        path: element.path,
                        message: element.message,
                    })
                });
            }
        }

        if (errorList?.length) {
            return res.status(409).json({ message: "Validation Error", error: errorList });

        }
        next()
    }
}