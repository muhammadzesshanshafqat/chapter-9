var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var db, itemCollection;
MongoClient.connect('mongodb://127.0.0.1:27017/demo', function(error, client) {
    if(error) {throw error};

    db = client.db('demo');
    itemsCollection = db.collection('items');

    app.listen(3000);
    console.log('Listening on port 3000');
});

//create router

var router = express.Router();
router.use(bodyParser.json());

//setup collection routes
router.route('/')
        .get(function(req, res, next) {
            itemCollection.find().toArray(function(err, docs) {
                res.send({
                    status: 'Item found', 
                    items: docs
                })
            })
        })
        .post(function(req, res, next) {
            var item = req.body;
            itemCollection.insertOne(item, function(error, doc) {
                res.send({
                    status: 'Item added',
                    itemId: item._id
                })
            })
        })
        
//setup the item routes
router.route('/:id')
            .delete(function(req, res, next) {
                var id = req.params['id'];
                var lookup = {_id: new mongodb.ObjectID(id)};
                itemCollection.deleteOne(lookup, function(err, result) {
                    res.send({status: 'Item deleted'})    
                });
            });

app.use(express.static(__dirname + '/public'))

app.use('/todo', router);