import { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { Camera, Tag, DollarSign, FileText, Send, Ruler } from 'lucide-react';

const PublicarProducto = () => {
  // Extraemos los datos del contexto
  const { setProductos, user, fetchProductos } = useContext(ProductContext);
  const navigate = useNavigate();

  // El token es vital para que el backend acepte la publicación
  const token = user?.token || localStorage.getItem('token');

  const [nuevoProducto, setNuevoProducto] = useState({
    titulo: '',
    precio: '',
    imagen_url: '',
    descripcion: '',
    talla_rango: '000', // Valor por defecto para prematuros
    estado_prenda: 'usado'
  });

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapeamos los campos exactamente como los espera tu controlador
    const productoParaDB = {
      vendedor_id: user?.id,
      categoria_id: 1,
      titulo: nuevoProducto.titulo,
      descripcion: nuevoProducto.descripcion,
      precio: Number(nuevoProducto.precio),
      stock: 1,
      imagen_url: nuevoProducto.imagen_url,
      talla_rango: nuevoProducto.talla_rango,
      estado_prenda: nuevoProducto.estado_prenda
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Agregamos el token de seguridad
        },
        body: JSON.stringify(productoParaDB)
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Producto publicado con éxito! ✨");

        /**
         * 🛡️ QA FIX: Manejo robusto de la actualización de productos
         * Si setProductos falla, intentamos usar fetchProductos para refrescar desde la DB
         */
        if (typeof setProductos === 'function') {
          // Si data devuelve el producto creado, lo agregamos al inicio
          const productoFinal = data.producto || data;
          setProductos(prev => [productoFinal, ...prev]);
        } else if (typeof fetchProductos === 'function') {
          await fetchProductos();
        }

        navigate('/catalogo');
      } else {
        alert("Error al publicar: " + (data.error || data.detalle || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Error al conectar con el servidor. Verifica que tu backend esté corriendo.");
    }
  };

  return (
    <Container className="my-5 pt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-lg rounded-4 p-4">
            <h2 className="fw-bold mb-4 text-center" style={{ color: '#ff85a2' }}>Nueva Publicación</h2>
            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold"><Tag size={16} className="me-2" />Título del Producto</Form.Label>
                <Form.Control
                  name="titulo"
                  placeholder="Ej: Body prematuro algodón"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold"><DollarSign size={16} className="me-2" />Precio</Form.Label>
                    <Form.Control
                      type="number"
                      name="precio"
                      placeholder="Precio en CLP"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold"><Ruler size={16} className="me-2" />Talla</Form.Label>
                    <Form.Select name="talla_rango" onChange={handleChange}>
                      <option value="000">000 (Menos de 2kg)</option>
                      <option value="00">00 (2kg a 2.5kg)</option>
                      <option value="0">0 (Recién nacido)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold"><Camera size={16} className="me-2" />URL de la Imagen</Form.Label>
                <Form.Control
                  name="imagen_url"
                  placeholder="https://link-de-la-foto.jpg"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold"><FileText size={16} className="me-2" />Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  placeholder="Detalla el estado de la prenda..."
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
                <Send size={18} className="me-2" /> Publicar ahora
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicarProducto;