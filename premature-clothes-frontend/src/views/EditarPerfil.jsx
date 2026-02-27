import { useState, useContext } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { User, Mail, Save, ArrowLeft, MapPin } from 'lucide-react'; // Añadimos MapPin
import { useNavigate } from 'react-router-dom';

const EditarPerfil = () => {
  const { user, setUser } = useContext(ProductContext);
  const navigate = useNavigate();

  // 1. Sincronizamos con los nombres de tu DB
  const [formData, setFormData] = useState({
    nombre_completo: user?.nombre_completo || '',
    email: user?.email || '',
    direccion_envio: user?.direccion_envio || ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            setUser(data.usuario); // Actualizamos el contexto con lo que devolvió la DB
            setShowSuccess(true);
            setTimeout(() => navigate('/profile'), 1500);
        } else {
            alert(data.msg);
        }
    } catch (error) {
        alert("Error al conectar con el servidor");
    }
};

  return (
    <Container className="my-5 pt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Button
            variant="link"
            className="text-decoration-none mb-3 p-0"
            style={{ color: '#ff85a2' }}
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft size={18} className="me-1" /> Volver al perfil
          </Button>

          <Card className="border-0 shadow-lg rounded-4 p-4">
            <h2 className="fw-bold mb-4">Editar Perfil</h2>

            {showSuccess && (
              <Alert variant="success" className="border-0 rounded-3">
                ¡Perfil actualizado con éxito! ✨
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Nombre Completo */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-muted"><User size={16} className="me-1" /> Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  placeholder="Ej: Fabián ..."
                  required
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-muted"><Mail size={16} className="me-1" /> Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Form.Group>

              {/* Dirección de Envío */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-muted"><MapPin size={16} className="me-1" /> Dirección de Envío</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.direccion_envio}
                  onChange={(e) => setFormData({ ...formData, direccion_envio: e.target.value })}
                  placeholder="Calle, Número, Comuna"
                  required
                />
              </Form.Group>

              <div className="d-grid mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="fw-bold py-3 border-0 shadow"
                  style={{ backgroundColor: '#ff85a2' }}
                >
                  <Save size={18} className="me-2" /> Guardar Cambios
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditarPerfil;