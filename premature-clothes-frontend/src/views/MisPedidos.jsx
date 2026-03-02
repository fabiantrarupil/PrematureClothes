import React, { useEffect, useState, useContext } from 'react';
import { Container, Table, Badge, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(UserContext);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/mis-pedidos`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPedidos(data);
        } else {
          setError("No pudimos cargar tus pedidos. Asegúrate de haber iniciado sesión.");
        }
      } catch (err) {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      obtenerPedidos();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getBadgeVariant = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'enviado': return 'info';
      case 'entregado': return 'success';
      case 'pendiente': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando tu historial...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold" style={{ color: '#ff85a2' }}>Historial de mis Pedidos 📦</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      {!token ? (
        <Alert variant="warning">Debes iniciar sesión para ver tus pedidos.</Alert>
      ) : pedidos.length === 0 ? (
        <Alert variant="light" className="text-center border">Aún no has realizado compras. ¡Tu bebé te espera! 👶</Alert>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4">ID Pedido</th>
                  <th className="py-3">Fecha</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="align-middle">
                    <td className="px-4 fw-bold text-secondary">#{pedido.id}</td>
                    <td>{pedido.fecha}</td>
                    <td>${Number(pedido.total).toLocaleString('es-CL')}</td>
                    <td>
                      <Badge bg={getBadgeVariant(pedido.estado)} className="px-3 py-2">
                        {pedido.estado}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" className="border-0 fw-bold">
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MisPedidos;