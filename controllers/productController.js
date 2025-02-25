// controllers/productController.js 
// Arreglo en memoria para almacenar productos 
let products = []; 
let nextId = 1; 

// GET /api/products - Obtener todos los productos 
exports.getAllProducts = (req, res) => { 
res.json(products); 
}; 

// GET /api/products/:id - Obtener un producto por su ID 
exports.getProductById = (req, res) => { 
const id = parseInt(req.params.id, 10); 
const product = products.find(p => p.id === id); 

if (!product) { 
return res.status(404).json({ message: 'Producto no encontrado' }); 
} 

res.json(product); 
}; 

// POST /api/products - Crear un nuevo producto 
exports.createProduct = (req, res) => { 
const { name, price } = req.body; 

if (!name || price == null) { 
return res.status(400).json({ message: 'Nombre y precio son requeridos' }); 
} 

const newProduct = { 
id: nextId++, 
name, 
price 
}; 

products.push(newProduct); 
res.status(201).json(newProduct); 
}; 

// PUT /api/products/:id - Actualizar un producto existente 
exports.updateProduct = (req, res) => { 
const id = parseInt(req.params.id, 10); 
const { name, price } = req.body; 
const product = products.find(p => p.id === id); 

if (!product) { 
return res.status(404).json({ message: 'Producto no encontrado' }); 
} 

// Actualizar propiedades solo si se envían en el body 
if (name !== undefined) product.name = name; 
if (price !== undefined) product.price = price; 
res.json(product); 
}; 

// DELETE /api/products/:id - Eliminar un producto 
exports.deleteProduct = (req, res) => { 
const id = parseInt(req.params.id, 10); 
const index = products.findIndex(p => p.id === id); 

if (index === -1) { 
return res.status(404).json({ message: 'Producto no encontrado' }); 
} 

const deletedProduct = products.splice(index, 1); 
res.json({ message: 'Producto eliminado', product: deletedProduct[0] }); 
};