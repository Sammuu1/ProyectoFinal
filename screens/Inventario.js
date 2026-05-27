import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

const InventarioContext = createContext();

export function InventarioProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [sucursalId, setSucursalId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sucursalId) return;

    setLoading(true);

    const inventarioRef = collection(
      db,
      'sucursales',
      sucursalId,
      'inventario'
    );

    const unsubscribe = onSnapshot(inventarioRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sucursalId]);

  const agregarProducto = async (nuevoProducto) => {
    if (!sucursalId) return;

    await addDoc(
      collection(db, 'sucursales', sucursalId, 'inventario'),
      {
        nombre: nuevoProducto.nombre,
        categoria: nuevoProducto.categoria,
        stock: Number(nuevoProducto.stock),
        minimo: Number(nuevoProducto.minimo),
      }
    );
  };

  const actualizarProducto = async (id, cambios) => {
    if (!sucursalId) return;

    const productoRef = doc(
      db,
      'sucursales',
      sucursalId,
      'inventario',
      id
    );

    await updateDoc(productoRef, cambios);
  };

  const eliminarProducto = async (id) => {
    if (!sucursalId) return;

    const productoRef = doc(
      db,
      'sucursales',
      sucursalId,
      'inventario',
      id
    );

    await deleteDoc(productoRef);
  };

  return (
    <InventarioContext.Provider
      value={{
        productos,
        loading,
        sucursalId,
        setSucursalId,
        agregarProducto,
        actualizarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </InventarioContext.Provider>
  );
}

export function useInventario() {
  const ctx = useContext(InventarioContext);

  if (!ctx) {
    throw new Error(
      'useInventario must be used inside InventarioProvider'
    );
  }

  return ctx;
}