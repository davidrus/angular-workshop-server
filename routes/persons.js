var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, {save:false});
db = new Db('persons', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'persons' database");
        db.collection('persons', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'persons' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving person: ' + id);
    db.collection('persons', function(err, collection) {
        collection.findOne({'id':id*1}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('persons', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addPerson = function(req, res) {
    var person = req.body;
    console.log('Adding person: ' + JSON.stringify(person));

    db.collection('persons', function(err, collection) {
        collection.find().sort({id:-1}).toArray(function(err, items) {
            console.log(items);
            person.id = (items[0].id*1)+1;
            db.collection('persons', function(err, collection) {
                collection.insert(person, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(result[0]));
                        res.send(result[0]);
                    }
                });
            });
        });
    });
    
};
 
exports.updatePerson = function(req, res) {
    var id = req.params.id;
    var person = req.body;
    console.log('Updating person: ' + id);
    delete person._id;
    console.log(JSON.stringify(person));
    db.collection('persons', function(err, collection) {
        collection.update({'id':id*1}, person, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating person: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(person);
            }
        });
    });
};
 
exports.deletePerson = function(req, res) {
    var id = req.params.id;
    console.log('Deleting person: ' + id);
    db.collection('persons', function(err, collection) {
        collection.remove({'id':id*1}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};


var populateDB = function() {
 
    var persons = [
    {
        firstname: "David",
        surname: "Rus",
        role: "1",
        id: 0
    },
    {
        firstname: "Josef",
        surname: "Šíma",
        role: "1",
        id: 1
    },
    {
        firstname: "Marek",
        surname: "Fojtl",
        role: "1",
        id: 2
    }];
 
    db.collection('persons', function(err, collection) {
        collection.insert(persons, {safe:true}, function(err, result) {});
    });
 
};
