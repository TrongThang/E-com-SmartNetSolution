// import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

function App() {
	console.log("ENV:", process.env.REACT_APP_SMART_NET_IOT_API_URL);
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