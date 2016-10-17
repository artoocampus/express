module.exports = function() {

    var users = require('../db/users.json');
    var weapons = require('../../weapons/db/weapons.json')
    var path = require('path');
    var jsonFile = require('jsonfile');

    var getList = function(req, res) {
        var genere = req.params.genere ? req.params.genere.toUpperCase() : ''; //UPPERCASE
        var name = req.query.name ?
            req.query.name.charAt(0).toUpperCase() + req.query.name.slice(1) : ''; //CAPITALIZE

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


    }

    var getDetails = function(req, res) {
        var id = req.params.id;
        var url = req.params.url;

        var user = users.filter(function(el) {
            return el.id === parseInt(id);
        })[0];

        var weaponsList = [];
        user.weapons.forEach(function(el) {
            for (var i = 0; i < weapons.length; i++) {
                if (weapons[i].id == el.id) {
                    el = JSON.parse(JSON.stringify(weapons[i]));
                    weaponsList.push(el);


                }
            }

        });

        user.weapons = JSON.parse(JSON.stringify(weaponsList));


        res.status(200);
        url ? res.send(user[url]) : res.send(user || 'utente inesistente');
        res.end();

    }

    var createUser = function(req, res) {

        var user = req.body;
        var max = 0;
        users.forEach(function(el) {
            max = el.id > max ? el.id : max;
        });
        user.id = max + 1;
        users.push(user);
        jsonFile.writeFile(path.join(__dirname, "..", "db", "users.json"), users, function(err) {
            //console.log(err);
        });
        res.send(users);
        res.end();
    };

    var deleteUser = function(req, res) {
        var id = req.params.id;
        var user = users.filter(function(el) {
            return el.id === parseInt(id);
        })[0];
        users.splice(users.indexOf(user), 1);
        jsonFile.writeFile(path.join(__dirname, "..", "db", "users.json"), users, function(err) {

        });
        res.status(200);
        res.send(users);
        res.end();

    };

    var updateUser = function(req, res) {
        var id = req.params.id;
        var newuser = JSON.parse(JSON.stringify(req.body));
        newuser.id = parseInt(id);

        var user = users.filter(function(el) {
            return el.id === parseInt(id);
        })[0];

        //eseguo update
        users.splice(users.indexOf(user), 1, newuser);
        jsonFile.writeFile(path.join(__dirname, "..", "db", "users.json"), users, function(err) {

        });
        res.status(200);
        res.send(newuser);
        res.end();

    };

    //API
    return {
        getList: getList,
        getDetails: getDetails,
        createUser: createUser,
        updateUser: updateUser,
        deleteUser: deleteUser
    }
};
