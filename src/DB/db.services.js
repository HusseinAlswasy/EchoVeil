
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