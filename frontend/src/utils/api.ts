// Nginx intercepta /api/ y lo manda al contenedor del backend en el puerto 5000
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/tamagotchi';

export const fetchStatus = async () => {
    const res = await fetch(`${API_URL}/status`);
    if (!res.ok) throw new Error('Error al obtener el estado');
    return res.json();
};

export const performAction = async (action: string) => {
    const res = await fetch(`${API_URL}/action`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error('Error al ejecutar la acción');
    return res.json();
};
