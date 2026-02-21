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
    const endpoint = esLogin ? '/usuarios/login' : '/usuarios/register';
    const urlBase = "http://localhost:3000";

    const payload = esLogin
      ? { email: usuario.email, password: usuario.password }
      : usuario;

    try {
      const response = await fetch(`${urlBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        const tokenEncontrado = data.token || (data.usuario && data.usuario.token);

        const usuarioParaGuardar = {
          ...(data.usuario || data),
          token: tokenEncontrado 
        };

        setUser(usuarioParaGuardar);
        localStorage.setItem('user', JSON.stringify(usuarioParaGuardar));

        alert('¡Bienvenido! ✨');
        
        // 🔍 QA REDIRECT: Si es admin, lo mandamos directo a gestión
        if (usuarioParaGuardar.rol === 'admin') {
          navigate('/admin/pedidos');
        } else {
          navigate('/catalogo');
        }
      } else {
        alert(`Error: ${data.msg || data.error || 'Credenciales incorrectas'}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor.");
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
            </div>

            <Form onSubmit={handleSubmit}>
              {!esLogin && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Nombre Completo</Form.Label>
                    <Form.Control name="nombre_completo" onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Dirección de Envío</Form.Label>
                    <Form.Control name="direccion_envio" onChange={handleChange} required />
                  </Form.Group>

                  {/* 🎯 SELECTOR ACTUALIZADO CON ROL ADMIN */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Tipo de Usuario</Form.Label>
                    <Form.Select name="rol" onChange={handleChange} value={usuario.rol}>
                      <option value="cliente">Quiero comprar (Cliente)</option>
                      <option value="vendedor">Quiero vender (Vendedor)</option>
                      <option value="admin">Administrador del Sistema 🛠️</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Email</Form.Label>
                <Form.Control type="email" name="email" onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold">Contraseña</Form.Label>
                <Form.Control type="password" name="password" onChange={handleChange} required />
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