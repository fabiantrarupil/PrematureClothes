import { useContext, useEffect, useState } from 'react';
import { Container, Table, Button, Form, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { UserCog, ShieldCheck, UserMinus, Mail, RefreshCw } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const GestionUsuarios = () => {
  const { user } = useContext(ProductContext);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 QA Check: Solo el administrador real puede gestionar usuarios
  const isAdmin = user?.rol === 'administrador';

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudo obtener la lista de usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para el "Update" del CRUD (Cambiar Rol)
  const handleCambiarRol = async (id, nuevoRol) => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}/rol`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rol: nuevoRol })
      });
      if (response.ok) {
        alert("Rol actualizado correctamente ✨");
        fetchUsuarios(); // Recargamos la lista
      }
    } catch (err) {
      alert("Error al actualizar el rol");
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsuarios();
  }, [isAdmin]);

  if (!isAdmin) {
    return <Alert variant="danger" className="m-5">Acceso restringido: Se requiere perfil administrador.</Alert>;
  }

  return (
    <Container className="my-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-dark">Gestión de Usuarios <UserCog size={30} className="ms-2" /></h2>
          <p className="text-muted small">Administra accesos y roles reales de la base de datos.</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={fetchUsuarios}>
          <RefreshCw size={16} className={`me-2 ${loading ? 'spin' : ''}`} /> Actualizar
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Table responsive hover className="align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="py-3">Rol</th>
                <th className="py-3">Estado</th>
                <th className="py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded-circle me-3">
                        <Mail size={18} className="text-muted" />
                      </div>
                      <div>
                        <div className="fw-bold">{u.nombre_completo || u.nombre}</div>
                        <small className="text-muted">{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Form.Select 
                      size="sm" 
                      value={u.rol} 
                      onChange={(e) => handleCambiarRol(u.id, e.target.value)}
                      className="w-auto border-0 bg-light fw-bold"
                    >
                      <option value="comprador">Comprador</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="administrador">Administrador</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Badge bg={u.activo !== false ? 'success' : 'secondary'}>
                      {u.activo !== false ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button variant="outline-danger" size="sm" title="Suspender">
                      <UserMinus size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
};

export default GestionUsuarios;