// routes/clientRoutes.js 
const express = require('express'); 
const router = express.Router(); 
const clientController = require('../controllers/clientController'); 

// Consultar clientes 
router.get('/', clientController.searchClient); 

// Consultar un cliente por ID 
router.get('/:id', clientController.searchClientById); 

// Crear un nuevo cliente 
router.post('/', clientController.newClient); 

// Actualizar un cliente existente 
router.put('/:id', clientController.updateClient);

// Eliminar un cliente 
router.delete('/:id', clientController.deleteClient);

module.exports = router; 