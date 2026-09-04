
export const create = async ({ model, data }) => {
    return await model.create([data]);
}

export const findOne = async ({ model, filter = {}, options = {} } = {}) => {
    const docs = model.findOne(filter)

    if (options.skip) {
        docs.skip(docs.skip);
    }

    if (options.limit) {
        docs.limit(docs.limit);
    }

    return await docs.exec()
}

export const findById = async ({ model, id, options = {} } = {}) => {
    const docs = model.findById(id)

    if (options?.select) {
        docs.select(options.select)
    }

    return await docs.exec()
}

export const findOneAndUpdate = async ({ model, filter = {}, update = {}, options = {} } = {}) => {
   
 const docs = model.findOneAndUpdate(filter, update, {...options, runValidators: true ,new:true})
 return await docs.exec()
}