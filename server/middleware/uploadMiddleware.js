import multer from "multer"

// Configure multer to use disk storage (default temp dir)
const upload = multer({ storage: multer.diskStorage({}) })

export default upload;