const multer = require('multer');
const fs = require('fs');
const path = require('path');

// 创建multer存储引擎
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        // 根据type创建文件夹
        const uploadsRoot = path.join(__dirname, '..', 'uploads');
        const uploadFolder = path.join(uploadsRoot, req.query.type);

        fs.mkdir(uploadFolder, { recursive: true }, (err) => {
            if (err) {
                cb(err); // 如果有错误，将错误对象作为第一个参数传递给cb
            } else {
                cb(null, uploadFolder); // 没有错误，将null作为第一个参数，并把目标目录作为第二个参数传递给cb
            }
        });
    },
    filename: function (req, file, cb) {
        // 生成唯一的文件名，避免冲突
        const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

module.exports = upload