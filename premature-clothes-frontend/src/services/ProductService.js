const API_URL = "http://localhost:3000";

// 1. Obtener todos los productos (Catálogo)
export const getProductos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error("Error al obtener el catálogo");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getProductos:", error);
    return [];
  }
};

// 2. Obtener un producto por ID (Vista de Detalle)
export const getProductoById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) throw new Error("Producto no encontrado");
    return await response.json();
  } catch (error) {
    console.error(`❌ Error al obtener producto ${id}:`, error);
    return null;
  }
};

// 3. Crear un nuevo producto (Publicar)
export const crearProducto = async (nuevoProducto) => {
  try {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al crear producto");
    return data; 
  } catch (error) {
    console.error("❌ Error en crearProducto:", error);
    throw error; 
  }
};

// 4. Sincronizar Favoritos (Ajustado a tus columnas: producto_id)
export const toggleFavoritoDB = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/api/favoritos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      // QA: Enviamos 'producto_id' para que coincida con tu DB
      body: JSON.stringify({ producto_id: id }) 
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al procesar favorito");
    
    return data;
  } catch (error) {
    console.error("❌ Error en toggleFavoritoDB:", error);
    throw error;
  }
};