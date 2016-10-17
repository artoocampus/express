var express = require('express');
var router = express.Router();
var userController = require('./../controller/user.controller.js')();


//Serve lista utenti o lista utenti filtrata per genere e poi per nome in query string 

router.get('/:genere?', userController.getList);

//Serve dettaglio utente e inidirizzo o avatar del singolo utente
router.get('/detail/:id/:url(address|avatar)?', userController.getDetails);


//Create new User
router.post('/', userController.createUser);

//Update User
router.put('/detail/:id', userController.updateUser);

//Delete User
router.delete('/detail/:id', userController.deleteUser);


module.exports = router;
