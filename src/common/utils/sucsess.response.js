
export const successResponse = ({ res, status = 200, message = "Done", data = undefined }) => {
    return res.status(200).json({ message , data });
}