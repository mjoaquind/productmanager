import multer from 'multer';
import __dirname from '../dirname.js';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        switch (file.fieldname) {
            case 'identity':
            case 'address':
            case 'account':
                cb(null, `${__dirname}/public/uploads/documents`);
                break;
            case 'products':
                cb(null, `${__dirname}/public/uploads/products`);
                break;
            case 'profile':
                cb(null, `${__dirname}/public/uploads/profile`);
                break;
            default:
                break;
        }
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({
    storage,
    onError: function(err, next) {
        console.log(err);
        next(err);
    }
});

export default uploader;