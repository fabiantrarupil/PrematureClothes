import { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const Auth = ({ inicialEsLogin }) => {
  const [esLogin, setEsLogin] = useState(inicialEsLogin);
  const { setUser } = useContext(ProductContext);
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre_completo: '',
    email: '',
    password: '',
    direccion_envio: '',
    rol: 'cliente' // Por defecto
  });

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔍 QA FIX: Construcción robusta de la URL
    const endpoint = esLogin ? '/usuarios/login' : '/usuarios/register';
    const urlBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Limpiamos barras para evitar "https://api.com//usuarios/register"
    const urlFinal = `${urlBase.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    const payload = esLogin
      ? { email: usuario.email, password: usuario.password }
      : usuario;

    try {
      console.log(`🚀 Intentando ${esLogin ? 'Login' : 'Registro'} en:`, urlFinal);

      const response = await fetch(urlFinal, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Manejo flexible del token según cómo responda tu API
        const tokenEncontrado = data.token || (data.usuario && data.usuario.token);

        const usuarioParaGuardar = {
          ...(data.usuario || data),
          token: tokenEncontrado 
        };

        setUser(usuarioParaGuardar);
        localStorage.setItem('user', JSON.stringify(usuarioParaGuardar));

        alert('¡Bienvenido! ✨');
        
        // Redirección basada en Rol
        if (usuarioParaGuardar.rol === 'admin') {
          navigate('/admin/pedidos');
        } else {
          navigate('/catalogo');
        }
      } else {
        // Muestra el mensaje de error que viene del backend (Render)
        alert(`Error: ${data.msg || data.error || 'Verifica tus datos'}`);
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      alert("No se pudo conectar con el servidor. Revisa tu conexión.");
    }
  };

  return (
    <Container className="my-5 pt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="border-0 shadow-lg rounded-4 p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ color: '#ff85a2' }}>
                {esLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
              </h2>
              <p className="text-muted small">
                {esLogin ? 'Ingresa a tu cuenta de PrematureClothes' : 'Únete a nuestra comunidad'}
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              {!esLogin && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Nombre Completo</Form.Label>
                    <Form.Control 
                      name="nombre_completo" 
                      placeholder="Ej: Juan Pérez"
                      onChange={handleChange} 
                      required 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Dirección de Envío</Form.Label>
                    <Form.Control 
                      name="direccion_envio" 
                      placeholder="Calle, Número, Comuna"
                      onChange={handleChange} 
                      required 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Tipo de Usuario</Form.Label>
                    <Form.Select name="rol" onChange={handleChange} value={usuario.rol}>
                      <option value="cliente">Quiero comprar (Cliente)</option>
                      <option value="vendedor">Quiero vender (Vendedor)</option>
                      <option value="admin">Administrador 🛠️</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Email</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  placeholder="email@ejemplo.com"
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold">Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password" 
                  placeholder="••••••••"
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-3 fw-bold border-0 shadow"
                style={{ backgroundColor: '#ff85a2' }}
              >
                {esLogin ? 'Ingresar' : 'Registrarme'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <Button
                variant="link"
                className="text-decoration-none text-muted small"
                onClick={() => setEsLogin(!esLogin)}
              >
                {esLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Ingresa aquí'}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;