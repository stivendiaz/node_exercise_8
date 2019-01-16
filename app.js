const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.get('/', function (req, res) {
    conection();
    if (req.query.name) {
        
        find(req.query.name,function (error, data) {
            console.log(data);



            // aqui update el valor con el nombre si existe en base de datos


          });

        
    } else {
        insert(formatObject("Anónimo", 1));
    }
    res.send('<h1>El visitante fue almacenado con éxito</h1>');
});

function formatObject(name, count) {
    return {
        name: name,
        count: count
    }
}

function insert(myobj) {
    var db = mongoose.connection;
    db.collection("visitantes").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
}

function find(personName, done) {
    var db = mongoose.connection;

        db.collection("visitantes").find({ name: personName }, function (err, data) {
          if (err) {
            done(err);
          }
          console.log(data)
        done(null, data);
        });
};






function conection() {
    mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', {
        useNewUrlParser: true
    });
}

app.listen(3000, () => console.log('Listening on port 3000!'));