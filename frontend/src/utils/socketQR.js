import axiosPublic from '@/apis/clients/public.client';
import io from 'socket.io-client';

export async function generateConnectionCode(customer_id) {
    try {
        const response = await axiosPublic.post('socket-qr/generate', { customer_id });
        if (response.success) {
            const { roomCode, password } = response.data;
            return { roomCode, password };
        }
        return null;
    } catch (error) {
        console.error('Error generating connection code:', error);
        return null;
    }
}

export async function verifyConnection(customer_id, roomCode, password) {
    try {
        const response = await axiosPublic.post('socket-qr/verify', {
            customer_id, roomCode, password
        });
        if (response.success) {
            return response.data.token;
        }
        return null;
    } catch (error) {
        console.error('Error verifying connection:', error);
        return null;
    }
}

export function connectSocket(token, roomCode) {
    return io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8081', {
        auth: { token },
        query: { roomCode }
    });
}