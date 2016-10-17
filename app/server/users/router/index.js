var express = require('express');
var router = express.Router();
var users = require('../db/users.json');
var path = require('path');
var jsonFile = require('jsonfile');



//Serve lista utenti o lista utenti filtrata per genere e poi per nome in query string 
router.get('/:genere?', function(req, res) {
    var genere = req.params.genere ? req.params.genere.toUpperCase() : ''; //UPPERCASE
    var name = req.query.name ?
        name.charAt(0).toUpperCase() + name.slice(1) : ''; //CAPITALIZE

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

        res.status(200);
        res.send(copy);
        res.end();
    }

    //Filtra solo il nome
    if (name) {
        listaFiltrata = users.filter(function(el) {
            return el.name === name;
        });
        var copy = JSON.parse(JSON.stringify(listaFiltrata));
        copy.unshift({ 'risultati': copy.length });
        res.status(200);
        res.send(copy);
        res.end();
    }

    //Senza filtro 
    else {
        var copy = JSON.parse(JSON.stringify(users));
        copy.unshift({ 'risultati': copy.length });
        res.status(200);
        res.send(copy);
        res.end();
        //res.sendFile(path.join(__dirname, '..', 'client', 'files', 'db', 'users.json'));

    }

});


//Serve dettaglio utente e inidirizzo o avatar del singolo utente
router.get('/detail/:id/:url(address|avatar)?', function(req, res) {
    var id = req.params.id;
    var url = req.params.url;

    var user = users.filter(function(el) {
        return el.id === parseInt(id);
    })[0];

    res.status(200);
    url ? res.send(user[url]) : res.send(user || 'utente inesistente');
    res.end();

});



//Create new User
router.post('/', function(req,res) {
	
	var user = req.body;
	var max = 0;
	users.forEach(function(el){
		max = el.id > max ? el.id : max;
	}); 
	user.id = max + 1;
	users.push(user);
	jsonFile.writeFile(path.join(__dirname,"..", "db", "users.json"), users ,function(err){
		//console.log(err);
	});
	res.send(users);
	res.end();
});

module.exports = router;
