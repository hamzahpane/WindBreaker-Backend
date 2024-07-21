const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../Category/model');
const Tag = require('../Tag/model');
const path = require('path');

const createProduck = async (req, res, next) => {
    try {
        let payload = req.body;

        if (payload.category) {
            let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
            if (category) {
                payload = {...payload, category: category._id}; // Set payload.category dengan _id kategori yang ditemukan
            } else {
                delete payload.category; // Hapus payload.category jika kategori tidak ditemukan
            }
        }


        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } });
            if (tags.length > 0) {
            
                payload.tags = tags.map(tag => tag._id);
            } else {
                delete payload.tags; 
            }
        }

        if (req.file) {
            let originalFilename = req.file.filename; // Mengambil nama file asli
            let filename = originalFilename; // Nama file baru akan sama dengan nama file asli
            
            try {
                let product = new Product({ ...payload, image_url: filename });
                await product.save();
                return res.json(product);
            } catch (error) {
                fs.unlinkSync(target_path);
                if (error.name === 'ValidationError') {
                    return res.json({
                        error: 1,
                        message: error.message,
                        fields: error.errors
                    });
                }
                next(error);
            }


        } else {
            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
}



const updateProduck = async (req, res, next) => {
    try {
        let payload = req.body;
        let { id } = req.params;

        if (payload.category) {
            let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
            if (category) {
                payload.category = category._id; // Set payload.category dengan _id kategori yang ditemukan
            } else {
                delete payload.category; // Hapus payload.category jika kategori tidak ditemukan
            }
        }

    
        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } });
            if (tags.length) {
                payload.tags = tags.map(tag => tag._id);
            } else {
                delete payload.tags;
            }
        }



        if (req.file) {
            let temp_path = req.file.path;
            let originalFilename = req.file.originalname;
            let filename = originalFilename; // Nama file baru akan sama dengan nama file asli

            // Simpan gambar baru ke direktori tujuan
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);
            const src = fs.createReadStream(temp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    // Hapus gambar lama jika ada
                    let product = await Product.findById(id);
                    let currentImage  = path.resolve(config.rootPath, `public/images/products/${product.image_url}`);
                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }

                    // Perbarui data produk dengan gambar baru
                    product = await Product.findByIdAndUpdate(id, { ...payload, image_url: filename }, {
                        new: true,
                        runValidators: true
                    });
                    return res.json(product);
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if (error.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields: error.errors
                        });
                    }
                    next(error);
                }
            });

            src.on('error', async (error) => {
                fs.unlinkSync(temp_path);
                next(error);
            });
        } else {
            // Jika tidak ada gambar yang diunggah, hanya perbarui data produk
            let product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            });
            return res.json(product);
        }

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
}



const getProduct = async (req, res, next) => {
    try {
        let { q = '', category = '', tags = [] } = req.query;
        let criteria = {};

        if (q.length) {
            criteria = {
                ...criteria,
                name: { $regex: `${q}`, $options: 'i' }
            };
        }

        if (category.length) {
            let foundCategory = await Category.findOne({ name: { $regex: `${category}`, $options: 'i' } });
            if (foundCategory) {
                criteria = { ...criteria, category: foundCategory._id };
            }
        }

        if (tags.length) {
            let foundTags = await Tag.find({ name: { $in: tags } });
            if (foundTags.length) {
                criteria = { ...criteria, tags: { $in: foundTags.map(tag => tag._id) } };
            }
        }

        // Menggunakan populate untuk menampilkan category dan tags pada produk
        let count = await Product.find().countDocuments();
        let products = await Product
            .find(criteria)
            // .skip(parseInt(skip))
            // .limit(parseInt(limit))
            .populate('category')
            .populate('tags');

        return res.json({
            
            data:products ,
            count});

    } catch (err) {
        next(err);
    }
}


const destoryProduct = async(req ,res ,next) =>{

try {
    let product = await Product.findByIdAndDelete(req.params.id);
    console.log(product);
    let currentImage  = path.resolve(config.rootPath, `public/images/products/${product.image_url}`);
    console.log(currentImage);
    if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
    }
    return res.json(product);
} catch (err) {
    next(err)
}
}
module.exports = {
    createProduck , 
    getProduct ,
    updateProduck,
    destoryProduct

};
