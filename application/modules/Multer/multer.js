const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            cb(new Error('Please upload an image.'));
        }
        cb(undefined, true);
    },
}).single('avatar');

module.exports = upload;