const express = require("express");
const mongoose = require("mongoose");
const pug = require('pug');


const app = express();
app.set('view engine', 'pug')

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', {
    useNewUrlParser: true
});

const VisitorSchema = new mongoose.Schema({
    name: {
        type: String
    },
    count: {
        type: Number,
        default: 0
    }
});
const Visitor = mongoose.model("Visitor", VisitorSchema);

app.get("/", async (req, res) => {

    if (req.query.name) {

        await Visitor.findOne({
            name: req.query.name
        }, async function (err, data) {
            console.log(data);
            if (data) {
                data.count = data.count + 1;
                await data.save(function (err) {
                    if (err) {
                        console.error('ERROR!');
                    }
                });
            } else {
                const visitor = new Visitor({
                    name: req.query.name,
                    count: 1
                });
                await visitor.save()
            }
        });
    } else {
        const visitor = new Visitor({
            name: "Anónimo",
            count: 1
        });
        await visitor.save()
    }

    await Visitor.find({}, async function(err,data){
        res.render('index', {visitors:data});
    });
    

});

app.listen(3000, () => console.log("Listening on port 3000 ..."));