import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<RouterProvider router={router} />
				<Toaster />
			</CartProvider>
		</AuthProvider>
	);
}

export default App;  