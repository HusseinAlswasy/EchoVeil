
export const create = async ({model,data}) => {
    return await model.create(data);
}

export const findOne = async({model,data})=>{
    return await model.findOne(data);
}