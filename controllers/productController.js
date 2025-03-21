// controllers/productController.js 
// Ajustes realizado para interacciones con la BD
const sql = require('mssql');
const { poolPromise } = require('../db');


// Consultar todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Productos');

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: error.message });
  }
};

// Consultar un producto por su ID
exports.getProductById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Productos WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  const { Nombre, Precio } = req.body;

  if (!Nombre || Precio == null) {
    return res.status(400).json({ message: 'Nombre y precio son requeridos' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Nombre', sql.NVarChar, Nombre)
      .input('Precio', sql.Decimal, Precio)
      .query('INSERT INTO Productos (Nombre, Precio) OUTPUT INSERTED.* VALUES (@Nombre, @Precio)');

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto existente
exports.updateProduct = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { Nombre, Precio } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('Nombre', sql.NVarChar, Nombre)
      .input('Precio', sql.Decimal, Precio)
      .query(`
        UPDATE Productos
        SET Nombre = COALESCE(@Nombre, Nombre),
            Precio = COALESCE(@Precio, Precio)
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Productos WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: error.message });
  }
};
