const path = '/Users/gabriel/Desktop/DCIM/100D5200/';
const fs = require('fs');
const fsExtra = require('fs-extra');
const parser = require('./metadata/parser');
const moment = require('moment');

fs.readdir(path, (err, files) => {

    console.log(`Found ${files.length} in ${path}`);

    files.forEach(file => {
        (function(photoPath, photoFile){
            parser.getMetadata(photoPath + photoFile).then( metadata => {
                const photoDate = moment(metadata.birthtime).locale('pt-br').format('L').replace(new RegExp("/", 'g'), "-");
                
                if(!fs.existsSync(path + photoDate))
                    fs.mkdirSync(path + photoDate);

                fsExtra.move(photoPath + photoFile, path + photoDate + "/" + photoFile, err =>{
                    if(err)
                        console.log(err);
                })
                
            }).catch((error) =>{
                console.log(error);
            } );
        })(path, file);
  });
})