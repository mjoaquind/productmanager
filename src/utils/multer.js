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
            case 'profiles':
                cb(null, `${__dirname}/public/uploads/profiles`);
                break;
            default:
                break;
        }
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});

const uploader = multer({ storage });

export default uploader;