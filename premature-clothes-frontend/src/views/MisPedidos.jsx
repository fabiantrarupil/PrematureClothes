import React from 'react';
import { Container, Table, Badge, Card, Button } from 'react-bootstrap';

const MisPedidos = () => {
  // Datos simulados para visualizar la estructura
  const pedidos = [
    { id: "ORD-7721", fecha: "01/02/2026", total: "$25.990", estado: "Enviado", items: 3 },
    { id: "ORD-6540", fecha: "15/01/2026", total: "$12.500", estado: "Entregado", items: 1 },
    { id: "ORD-5112", fecha: "20/12/2025", total: "$45.000", estado: "Entregado", items: 5 },
  ];

  const getBadgeVariant = (estado) => {
    switch (estado) {
      case 'Enviado': return 'info';
      case 'Entregado': return 'success';
      case 'Pendiente': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold" style={{ color: '#ff85a2' }}>Historial de mis Pedidos 📦</h2>
      
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4">ID Pedido</th>
                <th className="py-3">Fecha</th>
                <th className="py-3">Productos</th>
                <th className="py-3">Total</th>
                <th className="py-3">Estado</th>
                <th className="py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="align-middle">
                  <td className="px-4 fw-bold text-secondary">{pedido.id}</td>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.items} prendas</td>
                  <td>{pedido.total}</td>
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
      
      <div className="mt-4 text-center">
        <p className="text-muted small">
          ¿Tienes dudas con un pedido? <a href="/mensajes" className="text-decoration-none" style={{color: '#ff85a2'}}>Contáctanos aquí</a>.
        </p>
      </div>
    </Container>
  );
};

export default MisPedidos;