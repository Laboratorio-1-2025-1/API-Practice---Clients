// routes/productRoutes.js 
const express = require('express'); 
const router = express.Router(); 
const productController = require('../controllers/productController'); 

// Consultar todos los productos 
router.get('/', productController.getAllProducts); 

// Consultar un producto 
router.get('/:id', productController.getProductById); 

// Crear un nuevo producto 
router.post('/', productController.createProduct); 

// Actualizar un producto existente 
router.put('/:id', productController.updateProduct); 

// Eliminar un producto 
router.delete('/:id', productController.deleteProduct);

module.exports = router; 