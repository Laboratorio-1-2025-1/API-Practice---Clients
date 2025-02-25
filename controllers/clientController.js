// controllers/clientController.js 
// Arreglo en memoria para almacenar clientes 
const validator = require('validator');
let clients = []; 
let nextId = 1; 

// Función para validar correo electrónico
function isValidEmail(email) {
    return validator.isEmail(email);
}

// GET /api/clients - Obtener todos los clientes 
exports.getAllClients = (req, res) => { 
res.json(clients); 
}; 

// GET /api/clients/:id - Obtener un cliente por su ID 
exports.getClientById = (req, res) => { 
const id = parseInt(req.params.id, 10); 
const client = clients.find(p => p.id === id); 

if (!client) { 
return res.status(404).json({ message: 'Cliente no encontrado' }); 
} 

res.json(client); 
}; 

// POST /api/clients - Crear un nuevo cliente 
exports.createClient = (req, res) => { 
const { name, lastName, email, phoneNumb } = req.body; 

if (!name || !lastName || !email || !phoneNumb) { 
return res.status(400).json({ message: 'Se requieren los datos del cliente' }); 
} 

 // Validar el correo electrónico
 if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'El correo electrónico no es válido' });
}

const newClient = { 
id: nextId++, 
name, 
lastName,
email,
phoneNumb 
}; 

clients.push(newClient); 
res.status(201).json(newClient); 
}; 

// PUT /api/clients/:id - Actualizar un cliente existente 
exports.updateClient = (req, res) => { 
const id = parseInt(req.params.id, 10); 
const { name, lastName, email, phoneNumb } = req.body; 
const client = clients.find(p => p.id === id); 

if (!client) { 
return res.status(404).json({ message: 'Cliente no encontrado' }); 
} 

  // Validar el correo electrónico si es proporcionado
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ message: 'El correo electrónico no es válido' });
}

// Actualizar propiedades solo si se envían en el body 
if (name !== undefined) client.name = name; 
if (lastName !== undefined) client.lastName = lastName; 
if (email !== undefined) client.email = email; 
if (phoneNumb !== undefined) client.phoneNumb = phoneNumb; 

res.json(client); 
}; 

// DELETE /api/clients/:id - Eliminar un cliente 
exports.deleteClient = (req, res) => { 
const id = parseInt(req.params.id, 10); 
const index = clients.findIndex(p => p.id === id); 

if (index === -1) { 
return res.status(404).json({ message: 'Cliente no encontrado' }); 
} 

const deletedClient = clients.splice(index, 1); 
res.json({ message: 'Cliente eliminado', client: deletedClient[0] }); 
};