import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Sincronizar el token con localStorage y cargar datos básicos del usuario
  useEffect(() => {
    if (token) {
      // Aquí podrías decodificar el JWT o hacer un fetch a /api/usuarios/me
      // Por ahora, persistiremos el estado básico del usuario
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
      if (storedUser) setUser(storedUser);
    }
  }, [token]);

  // Función para iniciar sesión
  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem("token", userToken);
    localStorage.setItem("usuario", JSON.stringify(userData));
  };

  // Función para cerrar sesión
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, authenticated: !!token }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;