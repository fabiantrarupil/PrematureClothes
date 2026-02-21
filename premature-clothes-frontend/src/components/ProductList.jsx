import { useEffect, useState } from 'react';
import { getProductos } from './services/api';

const [productos, setProductos] = useState([]);

useEffect(() => {
  getProductos().then(data => setProductos(data));
}, []);