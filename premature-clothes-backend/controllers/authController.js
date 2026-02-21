
const registrarUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body; // Recibimos el rol
    const userRole = rol || 'user'; // Si no viene nada, es 'user' por defecto

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [nombre, email, hashedPassword, userRole];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar" });
    }
};