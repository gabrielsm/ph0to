const ExifImage = require('exif').ExifImage;
const fs = require('fs');

module.exports.getJPEGMetadata = (file) => {
    return new Promise((resolve, reject)=>{
        try {
            new ExifImage({ image : file }, function (error, exifData) {
                if (error)
                    reject(error)
                else
                    resolve(exifData)
            });
        } catch (error) {
            reject(error);
        }
    })
}

module.exports.getMetadata = file =>{
    return new Promise((resolve, reject)=>{
        fs.stat(file, (error, stats) =>{
            if (error)
                    reject(error)
                else
                    resolve(stats)
        })
    })
}