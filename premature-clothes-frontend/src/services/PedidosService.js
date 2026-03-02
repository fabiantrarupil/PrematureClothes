// src/services/pedidosServices.js
const API_URL = import.meta.env.VITE_API_URL;

export const getPedidosAdmin = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/pedidos/admin`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error("No se pudieron cargar los pedidos");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getPedidosAdmin:", error);
    throw error;
  }
};