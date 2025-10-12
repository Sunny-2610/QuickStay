import multer from "multer"

const upload = multer ({stroage: multer.diskStorage({})})

export default upload;