
var express = require('express'),
    cors = require('cors'),
    persons = require('./routes/persons');
 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
});

app.use(cors());

app.get('/persons', persons.findAll);
app.get('/persons/:id', persons.findById);
app.post('/persons', persons.addPerson);
app.put('/persons/:id', persons.updatePerson);
app.delete('/persons/:id', persons.deletePerson);

 
app.listen(process.env.PORT || 6666);
console.log('Listening on port 80...');