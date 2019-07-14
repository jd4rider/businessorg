const http = require('http');
const fs = require('fs');

const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const app = express();
const bodyParser = require('body-parser'); 
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/businessorg.db');
const upload = multer({ dest: 'tmp/csv/' });

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users                                       // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


db.serialize(function() {
    
    db.run('drop table business_capability')
    db.run('drop table business_processing')
    db.run('drop table business_functions')
    db.run(`CREATE TABLE business_capability 
            (capability_id integer primary key autoincrement,
            capability TEXT)`);
    db.run(`CREATE TABLE business_processing 
            (bprocessing_id integer primary key autoincrement,
            bprocessing TEXT, 
            associated_capability text
            )`);
    db.run(`CREATE TABLE business_functions
            (functions TEXT,
            associated_bprocessing text
            )`);
    

    function revitalize(){
        db.run('delete from business_capability; delete from business_functions; delete from business_processing;')
    }

    app.post('/upload', upload.single('file'), (req, res, next) => {
        process_csv(req.file.path)
        res.send('Success')
    })

    function process_csv(filepath){
        revitalize();
        let currcapability;
        let currprocessing;
        let runflag = 0;
        csv.parseFile(filepath)
           .on('data', function(data){
                if(runflag > 0){
                    function promise1(callback, callback2){
                        if(data[1].trim() != null && data[1].trim() != '') {
                            currcapability = data[1];
                            db.run('insert into business_capability (capability) values(?)', [data[1]], function(err) {
                                if (err) return console.log(err.message)
                            })
                        }
                        return callback(callback2, currcapability)
                    }
                    function promise2(callback, capability){
                        if(data[3].trim() != null && data[3].trim() != '') {
                            currprocessing = data[3];
                            db.run('insert into business_processing (bprocessing, associated_capability) values(?, ?)', [data[3], capability], function(err){
                                if (err) return console.log(err.message)
                            })
                        }
                        return callback(currprocessing)
                    }

                    function promise3(process){
                        if(data[5].trim() != null && data[5].trim() != '') {
                            db.run('insert into business_functions (functions, associated_bprocessing) values(?, ?)', [data[5], process], function(err){
                                if (err) return console.log(err.message)
                            })
                        }
                    }
                    promise1(promise2, promise3)

                    
                }
                runflag++
            })
            .on("end", function () {
                fs.unlinkSync(filepath);   // remove temp file
                //process "fileRows" and respond
                //setTimeout(function(){db.close()}, 5000)
            })
    }

    app.get('/api/bc', function(req, res){
        db.all('select capability from business_capability', function(err, rows){
            if (err) {
                //console.log(err);
                res.send(err);
            }
            //console.log(rows);
            res.json(rows);
        })
    })

    app.get('/api/bp', function(req, res){

    })

    app.get('/api/bf', function(req, res){

    })

    // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (var i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    // db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    //     console.log(row.id + ": " + row.info);
    // });
    //return db.close()
})

//db.close();

app.get('*', function(req, res) {
    res.sendFile(__dirname +'/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);
console.log("App listening on port 8080");
