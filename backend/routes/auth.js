const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Registro de usuario
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('nombre').notEmpty().trim(),
  body('apellido').notEmpty().trim(),
  body('telefono').optional().isMobilePhone(),
  body('rol_id').isInt({ min: 1 })
], async (req, res) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nombre, apellido, telefono, rol_id } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hashear password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = await query(
      `INSERT INTO usuarios (email, password_hash, nombre, apellido, telefono, rol_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, nombre, apellido, telefono, rol_id, fecha_registro`,
      [email, hashedPassword, nombre, apellido, telefono, rol_id]
    );

    // Generar JWT
    const token = jwt.sign(
      { userId: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login de usuario
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuario
    const user = await query(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuarios u 
       LEFT JOIN rol r ON u.rol_id = r.id 
       WHERE u.email = $1 AND u.activo = true`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar password
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Actualizar último acceso
    await query(
      'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
      [user.rows[0].id]
    );

    // Generar JWT
    const token = jwt.sign(
      { userId: user.rows[0].id, rol: user.rows[0].rol_nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password_hash, ...userWithoutPassword } = user.rows[0];

    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener perfil de usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await query(
      `SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.fecha_registro, 
              u.ultimo_acceso, r.nombre as rol_nombre
       FROM usuarios u 
       LEFT JOIN rol r ON u.rol_id = r.id 
       WHERE u.id = $1`,
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: user.rows[0] });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, userId: req.user.userId });
});

module.exports = router;