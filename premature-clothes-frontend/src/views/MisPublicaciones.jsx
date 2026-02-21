import { useContext } from 'react';
import { Container, Table, Button, Badge, Card } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { Edit3, Trash2, Plus, PackageOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MisPublicaciones = () => {
  const { productos } = useContext(ProductContext);
  const navigate = useNavigate();

  const misProductos = productos || [];

  console.log(productos);

  return (
    <Container className="my-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Panel de Inventario</h2>
          <p className="text-muted">Control total de la base de datos de PrematureClothes.</p>
        </div>
        <Button
          variant="primary"
          style={{ backgroundColor: '#ff85a2', border: 'none' }}
          onClick={() => navigate('/publicar')}
          className="fw-bold shadow-sm"
        >
          <Plus size={18} className="me-2" /> Nueva Publicación
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Table responsive hover className="align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4">ID</th>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {misProductos.length > 0 ? (
              misProductos.map((item) => (
                <tr key={item.id_producto || item.id}>
                  <td className="px-4 text-muted small">#{item.id_producto || item.id}</td>
                  <td>
                    <img
                      // Priorizamos url_imagen que es el estándar de base de datos
                      src={item.imagen_url || item.img || 'https://placehold.co/40'}
                      alt={item.titulo}
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      className="rounded bg-light"
                    />
                  </td>
                  <td><span className="fw-bold">{item.titulo || 'Sin nombre'}</span></td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '150px' }}>
                      {item.descripcion || 'Sin descripción'}
                    </div>
                  </td>
                  <td>
                    {item.precio 
                      ? `$${Number(item.precio).toLocaleString('es-CL')}` 
                      : '$0'}
                  </td>
                  <td>{item.stock ?? 0} u.</td>
                  <td>
                    {/* Lógica de estado basada en stock o campo activo */}
                    <Badge bg={item.stock > 0 ? "success" : "danger"}>
                      {item.stock > 0 ? "En Stock" : "Agotado"}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/editar/${item.id_producto || item.id}`)}>
                        <Edit3 size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted">
                  <PackageOpen size={48} className="mb-3 opacity-50" />
                  <h5>No se encontraron registros en la base de datos</h5>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default MisPublicaciones;