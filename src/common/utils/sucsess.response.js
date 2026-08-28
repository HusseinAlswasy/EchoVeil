
export const successResponse = ({ res, status = 200, message = "Done Successfuly", data = undefined }) => {
    return res.status(status).json({ message, data });
}