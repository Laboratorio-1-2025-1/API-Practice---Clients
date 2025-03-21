// index.js 
const express = require('express'); 
const productRoutes = require('./routes/productRoutes'); 
const clientRoutes = require('./routes/clientRoutes');
const app = express(); 
const PORT = process.env.PORT || 3000; 
const { poolPromise } = require('./db'); 

// Middleware para parsear JSON en las peticiones 
app.use(express.json()); 

// Rutas de la API para productos 
app.use('/api/products', productRoutes); 
app.use('/api/clients', clientRoutes); 

// Inicio del servidor 
app.listen(PORT, () => { 
console.log(`Servidor corriendo en el puerto ${PORT}`); 
}); 