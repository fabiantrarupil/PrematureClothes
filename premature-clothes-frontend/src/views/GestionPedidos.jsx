import { useContext, useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Eye, Truck, CheckCircle, Clock, ShieldAlert, RefreshCw } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const GestionPedidos = () => {
  const { user } = useContext(ProductContext);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 QA Check: Validación de Admin robusta (soporta español e inglés)
  const isAdmin = user?.rol === 'administrador';

  // Función para obtener los pedidos reales de la DB
  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/admin`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('No se pudieron cargar los pedidos');
      
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPedidos();
    }
  }, [isAdmin]);

  // 1. Guarda de Seguridad: Si no es admin, mostramos bloqueo
  if (!isAdmin) {
    return (
      <Container className="my-5 pt-5 text-center">
        <Alert variant="danger" className="py-5 shadow-sm rounded-4">
          <ShieldAlert size={50} className="mb-3 text-danger" />
          <Alert.Heading className="fw-bold">Acceso Denegado</Alert.Heading>
          <p>Esta sección es exclusiva para el Administrador de PrematureClothes.</p>
          <Button variant="danger" href="/catalogo">Volver al Catálogo</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Gestión de Pedidos 📦</h2>
          <p className="text-muted small">Panel de administración de ventas reales.</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={fetchPedidos} disabled={loading}>
          <RefreshCw size={16} className={`me-2 ${loading ? 'spin' : ''}`} /> 
          Actualizar Lista
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Conectando con la base de datos...</p>
        </div>
      ) : error ? (
        <Alert variant="warning">Ocurrió un error: {error}. Asegúrate de que el backend esté encendido.</Alert>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Table responsive hover className="align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-secondary small fw-bold">ID PEDIDO</th>
                <th className="py-3 text-secondary small fw-bold">FECHA</th>
                <th className="py-3 text-secondary small fw-bold">CLIENTE</th>
                <th className="py-3 text-secondary small fw-bold">TOTAL</th>
                <th className="py-3 text-secondary small fw-bold">ESTADO</th>
                <th className="py-3 text-center text-secondary small fw-bold">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">No hay pedidos registrados en la base de datos.</td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="px-4 py-3 fw-bold text-primary">#{pedido.id}</td>
                    <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                    <td>{pedido.cliente || 'Usuario Registrado'}</td>
                    <td className="fw-bold">${Number(pedido.total).toLocaleString('es-CL')}</td>
                    <td>
                      <Badge 
                        bg={pedido.estado === 'Pendiente' ? 'warning' : pedido.estado === 'Enviado' ? 'info' : 'success'} 
                        className="fw-normal px-3 py-2 text-dark"
                      >
                        {pedido.estado === 'Pendiente' && <Clock size={14} className="me-1" />}
                        {pedido.estado === 'Enviado' && <Truck size={14} className="me-1" />}
                        {pedido.estado === 'Entregado' && <CheckCircle size={14} className="me-1" />}
                        {pedido.estado}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button variant="outline-secondary" size="sm" title="Ver detalle">
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          style={{ backgroundColor: '#ff85a2', border: 'none' }}
                        >
                          Actualizar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
};

export default GestionPedidos;