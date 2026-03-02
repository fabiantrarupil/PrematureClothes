import { useContext, useState } from 'react';
import { Container, Table, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext'; // 🛡️ Importación vital
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CarritoCompras = () => {
  // Consumimos ambos contextos para tener datos de productos y de sesión
  const { carrito = [], totalCarrito = 0, eliminarDelCarrito, ajustarCantidad, limpiarCarrito } = useContext(ProductContext);
  const { token, user } = useContext(UserContext); // Sacamos el token real del UserContext
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Definimos el rol para mostrar en la UI (fallback al localStorage por seguridad de persistencia)
  const userRole = user?.rol || localStorage.getItem('userRole') || 'Invitado';

  const handlePagar = async () => {
    // 🔍 Verificación de QA: ¿Hay sesión activa?
    if (!token) {
      alert("Tu sesión ha expirado o no has iniciado sesión. Redirigiendo al ingreso...");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Enviamos el total y los items para que el backend pueda procesar el pedido
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 🔑 LA LLAVE que resuelve el error 401
        },
        body: JSON.stringify({ 
          total: totalCarrito,
          productos: carrito // Enviamos los productos para el detalle del pedido
        })
      });

      if (response.ok) {
        alert("¡Compra realizada con éxito! 👶👕 El pedido de PrematureClothes ha sido registrado.");

        if (limpiarCarrito) {
          limpiarCarrito();
        }

        // Redirigimos a la vista de Mis Pedidos que estamos construyendo
        navigate('/mis-pedidos'); 
      } else {
        const errorData = await response.json();
        // Si el error es 401, informamos que la sesión no es válida
        if (response.status === 401) {
          alert("Error de autenticación. Por favor, vuelve a iniciar sesión.");
          navigate('/login');
        } else {
          alert(`Error: ${errorData.detalle || "No se pudo procesar el pedido"}`);
        }
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      alert("Hubo un error de conexión con el servidor. Por favor, intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // UI para carrito vacío
  if (carrito.length === 0) {
    return (
      <Container className="text-center py-5 mt-5">
        <ShoppingBag size={80} className="text-muted mb-4 opacity-50" />
        <h2 className="fw-bold">Tu carrito está vacío</h2>
        <Button
          variant="primary"
          className="border-0 px-4 py-2 fw-bold mt-3"
          style={{ backgroundColor: '#ff85a2' }}
          onClick={() => navigate('/catalogo')}
        >
          Ir al catálogo
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5 pt-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={() => navigate(-1)} className="text-muted p-0 me-3">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="fw-bold m-0">Mi Carrito</h2>
      </div>

      <Row className="gy-4">
        <Col lg={8}>
          <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
            <Table responsive className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">Producto</th>
                  <th className="py-3 border-0">Precio</th>
                  <th className="py-3 border-0 text-center">Cantidad</th>
                  <th className="py-3 border-0 text-end px-4">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item, index) => {
                  const itemId = item.id_producto || item.id;
                  return (
                    <tr key={`${itemId}-${index}`} className="border-bottom">
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.imagen || item.img || 'https://placehold.co/60'}
                            alt={item.nombre}
                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            className="me-3 rounded border bg-light"
                          />
                          <div>
                            <div className="fw-bold mb-1">{item.nombre || item.titulo}</div>
                            <Button
                              variant="link"
                              className="text-danger p-0 small text-decoration-none"
                              onClick={() => eliminarDelCarrito(itemId)}
                            >
                              <Trash2 size={14} className="me-1" /> Quitar
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">
                        ${Number(item.precio || 0).toLocaleString('es-CL')}
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <Button
                            variant="light"
                            size="sm"
                            className="border"
                            onClick={() => ajustarCantidad && ajustarCantidad(itemId, -1)}
                            disabled={item.cantidad <= 1 || loading}
                          >
                            <Minus size={12} />
                          </Button>
                          <span className="fw-bold px-1">{item.cantidad}</span>
                          <Button
                            variant="light"
                            size="sm"
                            className="border"
                            onClick={() => ajustarCantidad && ajustarCantidad(itemId, 1)}
                            disabled={item.cantidad >= (item.stock || 99) || loading}
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                      </td>
                      <td className="fw-bold text-end px-4">
                        ${(Number(item.precio || 0) * item.cantidad).toLocaleString('es-CL')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '110px' }}>
            <h5 className="fw-bold mb-4">Resumen de Orden</h5>
            <div className="d-flex justify-content-between mb-4 fw-bold fs-4">
              <span>Total</span>
              <span style={{ color: '#ff85a2' }}>${totalCarrito.toLocaleString('es-CL')}</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-100 border-0 fw-bold py-3 shadow d-flex align-items-center justify-content-center"
              style={{ backgroundColor: '#ff85a2' }}
              onClick={handlePagar}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard size={20} className="me-2" />
                  Confirmar Compra
                </>
              )}
            </Button>
            <p className="text-center text-muted small mt-3">
              Identificado como: <strong>{user?.email || 'Usuario'}</strong>
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CarritoCompras;