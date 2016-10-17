var express = require('express');
var app = express();
var path = require('path');
var users = require('../client/files/db/users');

const PORT = 3000;

//Serve static files
app.use('/static', express.static(path.join(__dirname, '..', 'client', 'files')));

//Serve index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

//Serve lista utenti o lista utenti filtrata per genere e poi per nome in query string 
app.get('/users/:genere?', function(req, res) {
    var genere = req.params.genere.toUpperCase(); //UPPERCASE
    var name = req.query.name;
    var name = name.charAt(0).toUpperCase() + name.slice(1); //CAPITALIZE

    var listaFiltrata = [];
    
    //Filtra per genere
    if (genere) {
        listaFiltrata = users.filter(function(el) {
            return el['gender'] === genere;
        });
        
        //se c'è anche per nome
        if (name) {
            listaFiltrata = listaFiltrata.filter(function(el) {
                return el.name === name;
            });
        }
        var copy = JSON.parse(JSON.stringify(listaFiltrata));
        copy.unshift({ 'risultati': copy.length });
        res.send(copy);
    }
    
    //Filtra solo il nome
    if (name) {
        listaFiltrata = users.filter(function(el) {
            return el.name === name;
        });
        var copy = JSON.parse(JSON.stringify(listaFiltrata));
        copy.unshift({ 'risultati': copy.length });
        res.send(copy);
    }
    
    //Senza filtro 
    else {
        var copy = JSON.parse(JSON.stringify(users));
        copy.unshift({ 'risultati': copy.length });
        res.send(copy);
        //res.sendFile(path.join(__dirname, '..', 'client', 'files', 'db', 'users.json'));

    }

});


//Serve dettaglio utente e inidirizzo o avatar del singolo utente
app.get('/user/:id/:url(address|avatar)?', function(req, res) {
    var id = --req.params.id;
    var url = req.params.url;

    url ? res.send(users[id][url]) : res.send(users[id] || 'utente inesistente');

});


//Start Server
app.listen(PORT, function() {
    console.log("serve on http://localhost:" + PORT);
});
