// controllers/clientController.js 
const validator = require('validator');
const sql = require('mssql');
// Ajustes realizado para interacciones con la BD
const { poolPromise } = require('../db');

// Consultar todos los clientes
exports.searchClient = async (req, res) => {
  try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM Clientes');
      res.json(result.recordset);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Consultar clientes por ID
exports.searchClientById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  // Validar que el ID sea válido
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Clientes WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(result.recordset[0]); // Retorna el primer resultado encontrado
  } catch (error) {
    console.error("Error al consultar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Crear clientes 
exports.newClient = async (req, res) => {
  const { Nombre, Apellido, Telefono, Correo } = req.body;

  //Validación de Correo Electrónico
  if (!validator.isEmail(Correo)) {
    return res.status(400).json({ error: "Correo electrónico inválido" });
  }
  try {
      const pool = await poolPromise;
      await pool.request()
          .input('Nombre', sql.NVarChar, Nombre)
          .input('Apellido', sql.NVarChar, Apellido)
          .input('Telefono', sql.NVarChar, Telefono)
          .input('Correo', sql.NVarChar, Correo)
          .query('INSERT INTO Clientes (Nombre, Apellido, Telefono, Correo) VALUES (@Nombre, @Apellido, @Telefono, @Correo)');
      res.status(201).json({ mensaje: 'Cliente creado exitosamente' });
  } catch (error) {
      console.error("Error al crear cliente:", error); // Log del error al crear el cliente
      res.status(500).json({ error: error.message }); // Detalles del error
  }
};

// Actualizar clientes existentes
exports.updateClient = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { Nombre, Apellido, Telefono, Correo } = req.body;

  // Validación del ID del cliente antes de actualizar
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }
  // Validación de Correo Electrónico
  if (Correo && !validator.isEmail(Correo)) {
    return res.status(400).json({ error: "Correo electrónico inválido" });
  }

  try {
      const pool = await poolPromise;
      const result = await pool.request()
          .input('id', sql.Int, id)
          .input('Nombre', sql.NVarChar, Nombre)
          .input('Apellido', sql.NVarChar, Apellido)
          .input('Telefono', sql.NVarChar, Telefono)
          .input('Correo', sql.NVarChar, Correo)
          .query(`
              UPDATE Clientes
              SET Nombre = @Nombre, Apellido = @Apellido, Telefono = @Telefono, Correo = @Correo 
              WHERE id = @id
          `);

      if (result.rowsAffected[0] === 0) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Eliminar clientes 
exports.deleteClient = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
      const pool = await poolPromise;
      const result = await pool.request()
          .input('id', sql.Int, id)
          .query('DELETE FROM Clientes WHERE id = @id');

      if (result.rowsAffected[0] === 0) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

