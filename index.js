const path = '/Users/gabriel/Desktop/DCIM/100D5200/';
const fs = require('fs');
const fsExtra = require('fs-extra');
const parser = require('./metadata/parser');
const moment = require('moment');

var moves = [];

fs.readdir(path, (err, files) => {

    console.log(`Found ${files.length} in ${path}`);

    files.forEach(file => {
        (function(photoPath, photoFile){

            const promise = new Promise((resolve, reject) =>{
                parser.getMetadata(photoPath + photoFile).then( metadata => {
                    const photoDate = moment(metadata.birthtime).locale('pt-br').format('L').replace(new RegExp("/", 'g'), "-");
                    
                    if(!fs.existsSync(path + photoDate))
                        fs.mkdirSync(path + photoDate);
    
                    fsExtra.move(photoPath + photoFile, path + photoDate + "/" + photoFile, err =>{
                        if(err){
                            console.log(err);
                            reject();
                        }
                        else{
                            resolve();
                        }                        
                    })
                    
                }).catch((error) =>{
                    console.log(error);
                } );
            });

            moves.push(promise);
            
        })(path, file);
  });

  Promise.all(moves).then(()=>{
    fs.readdir(path, (err, folders) => {
        folders.filter(folder =>{
            return fs.statSync(path + folder).isDirectory();
        });

        folders.forEach(folder => {
            fsExtra.move(path + folder, `/Users/gabriel/Dropbox/RAW/` + folder, err =>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log(`Moved ${folder}`);
                }                     
            })
        })

    });

    console.log("Moving created folders now...");
  })
})