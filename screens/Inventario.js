import React, { createContext, useContext, useState } from 'react';

const InventarioContext = createContext();

// ─── Initial mock data ────────────────────────────────────────────────────────
const INITIAL_PRODUCTOS = [
    { id: '1', nombre: 'Discos de Pizza (Grande)', categoria: 'Masas', stock: 20, minimo: 15 },
    { id: '2', nombre: 'Salsa Pomodoro', categoria: 'Salsas', stock: 8, minimo: 10 },
    { id: '3', nombre: 'Prosciutto di Parma', categoria: 'Carnes', stock: 12, minimo: 8 },
    { id: '4', nombre: 'Queso Mozzarella', categoria: 'Lácteos', stock: 25, minimo: 15 },
    { id: '5', nombre: 'Queso Parmesano', categoria: 'Lácteos', stock: 8, minimo: 10 },
];

// ─── Provider ─────────────────────────────────────────────────────────────────
export function InventarioProvider({ children }) {
    const [productos, setProductos] = useState(INITIAL_PRODUCTOS);

    const agregarProducto = (nuevoProducto) => {
        setProductos(prev => [
            ...prev,
            { ...nuevoProducto, id: Date.now().toString() },
        ]);
    };

    const actualizarProducto = (id, cambios) => {
        setProductos(prev =>
            prev.map(p => (p.id === id ? { ...p, ...cambios } : p))
        );
    };

    const eliminarProducto = (id) => {
        setProductos(prev => prev.filter(p => p.id !== id));
    };

    return (
        <InventarioContext.Provider
            value={{ productos, agregarProducto, actualizarProducto, eliminarProducto }}
        >
            {children}
        </InventarioContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useInventario() {
    const ctx = useContext(InventarioContext);
    if (!ctx) throw new Error('useInventario must be used inside InventarioProvider');
    return ctx;
}