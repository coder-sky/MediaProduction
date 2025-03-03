import multer from "multer";
import fs from 'fs'
import path from "path";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder_path = `public/client/`;
    
        if (!fs.existsSync(folder_path)) {
            fs.mkdirSync(folder_path, { recursive: true });
        }
        
        cb(null, folder_path);
    },
    filename: function(req, file, cb){
        cb(null, 'file'+ '_' + Date.now() + path.extname(file.originalname))

    }

    
})

const logoStorage = multer({storage})

export default logoStorage