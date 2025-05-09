import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import { cartReducer, initialState } from './cart.reducer';
import {
    addToCart,
    addToCartSuccess,
    addToCartFailure,
    removeFromCart,
    removeFromCartSuccess,
    removeFromCartFailure,
    updateQuantity,
    updateQuantitySuccess,
    updateQuantityFailure,
    clearCart,
    clearCartSuccess,
    clearCartFailure,
    setCart,
    syncCart
} from './cart.actions';
import Cookies from 'js-cookie';
// import { useAuth } from './AuthContext';
import cartApi from '@/apis/modules/cart.api.ts';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { isAuthenticated, user } = useState(false) // useAuth();

    const cartStats = useMemo(() => {
        const items = state?.items || [];

        return {
            totalItems: items.reduce((total, item) => total + 1, 0),
            totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0),
            itemCount: items.length, // Số lượng loại sản phẩm khác nhau
        };
    }, [state.items]);

    // Hàm để lưu cart vào cookie
    const saveCartToCookie = (cart) => {
        try {
            // Đảm bảo dữ liệu cart hợp lệ
            if (!cart || !Array.isArray(cart.items)) {
                console.error('Invalid cart data:', cart);
                return;
            }

            const simplifiedCart = {
                items: cart.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price || item.selling_price,
                    quantity: item.quantity,
                    // Thêm các trường cần thiết khác
                })),
                total: cart.total
            };

            // Chuyển đổi dữ liệu cart thành chuỗi JSON
            const cartString = JSON.stringify(simplifiedCart);
            console.log('Saving cart to cookie:', cartString); // Debug log
            
            // Lưu vào cookie với các options
            Cookies.set('cart', cartString, {
                expires: 7,
                path: '/',
                // secure: process.env.NODE_ENV === 'production', 
                // sameSite: 'strict' // Bảo mật hơn
            });

            // Kiểm tra xem cookie đã được lưu thành công chưa
            const savedCart = Cookies.get('cart');
            console.log('Saved cart from cookie:', savedCart); // Debug log

            if (!savedCart) {
                throw new Error('Failed to save cart to cookie');
            }
        } catch (error) {
            console.error('Error saving cart to cookie:', error);
            // toast.error('Không thể lưu giỏ hàng');
        }
    };

    // Hàm để lấy cart từ cookie
    const getCartFromCookie = () => {
        try {
            const cartCookie = Cookies.get('cart');
            if (cartCookie) {
                return JSON.parse(cartCookie);
            }

            return null;
        } catch (error) {
            console.error('Error getting cart from cookie:', error);
            return null;
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async (product) => {
        try {
            console.log('handleAddToCart received product:', product);

            dispatch(addToCart(product));

            if (isAuthenticated) {
                const updatedCart = await cartApi.addToCart(product.id, 1);
                dispatch(addToCartSuccess(updatedCart));
            } else {
                const cookieCart = getCartFromCookie() || { items: [], total: 0 };
                console.log('cookieCart:', cookieCart);
                const existingItemIndex = cookieCart.items.findIndex(item => item.id === product.id);

                console.log('New quantity to add:', product.quantity);

                if (existingItemIndex !== -1) {
                    cookieCart.items[existingItemIndex].quantity += product.quantity;
                } else {
                    cookieCart.items.push({
                        id: product.id,
                        name: product.name,
                        price: product.price || product.selling_price,
                        quantity: product.quantity || 1,
                        // Thêm các trường cần thiết khác
                    });
                }

                cookieCart.total = cookieCart.items.reduce(
                    (total, item) => total + (item.price * item.quantity),
                    0
                );

                saveCartToCookie(cookieCart);
                dispatch(addToCartSuccess(cookieCart));
            }
        } catch (error) {
            dispatch(addToCartFailure(error.message));
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveFromCart = async (productId) => {
        try {
            dispatch(removeFromCart(productId));

            if (isAuthenticated) {
                const updatedCart = await cartApi.removeFromCart(productId);
                dispatch(removeFromCartSuccess(updatedCart));
            } else {
                const cookieCart = getCartFromCookie();
                if (cookieCart) {
                    cookieCart.items = cookieCart.items.filter(item => item.id !== productId);
                    cookieCart.total = cookieCart.items.reduce(
                        (total, item) => total + (item.price * item.quantity),
                        0
                    );

                    saveCartToCookie(cookieCart);
                    dispatch(removeFromCartSuccess(cookieCart));
                }
            }
        } catch (error) {
            dispatch(removeFromCartFailure(error.message));
        }
    };

    // Cập nhật số lượng sản phẩm
    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            dispatch(updateQuantity(productId, quantity));

            if (isAuthenticated) {
                const updatedCart = await cartApi.updateQuantity(productId, quantity);
                dispatch(updateQuantitySuccess(updatedCart));
            } else {
                const cookieCart = getCartFromCookie();
                if (cookieCart) {
                    const item = cookieCart.items.find(item => item.id === productId);
                    if (item) {
                        item.quantity = quantity;
                        cookieCart.total = cookieCart.items.reduce(
                            (total, item) => total + (item.price * item.quantity),
                            0
                        );

                        saveCartToCookie(cookieCart);
                        dispatch(updateQuantitySuccess(cookieCart));
                    }
                }
            }
        } catch (error) {
            dispatch(updateQuantityFailure(error.message));
        }
    };

    // Xóa toàn bộ giỏ hàng
    const handleClearCart = async () => {
        try {
            dispatch(clearCart());

            if (isAuthenticated) {
                await cartApi.clearCart();
                dispatch(clearCartSuccess());
            } else {
                Cookies.remove('cart');
                dispatch(clearCartSuccess());
            }
        } catch (error) {
            dispatch(clearCartFailure(error.message));
        }
    };

    // Hàm để đồng bộ cart với server
    const syncCartWithServer = async () => {
        try {
            dispatch(syncCart());

            if (isAuthenticated) {
                const serverCart = await cartApi.getCart();
                const cookieCart = getCartFromCookie();

                if (cookieCart && cookieCart.items.length > 0) {
                    // Merge cart từ cookie với cart từ server
                    const mergedCart = {
                        items: [...serverCart.items],
                        total: serverCart.total,
                    };

                    // Thêm các items từ cookie vào server cart
                    cookieCart.items.forEach(cookieItem => {
                        const existingItem = mergedCart.items.find(item => item.id === cookieItem.id);
                        if (existingItem) {
                            existingItem.quantity += cookieItem.quantity;
                        } else {
                            mergedCart.items.push(cookieItem);
                        }
                    });

                    // Cập nhật tổng tiền
                    mergedCart.total = mergedCart.items.reduce(
                        (total, item) => total + (item.price * item.quantity),
                        0
                    );

                    // Cập nhật cart lên server
                    await cartApi.updateCart(mergedCart);

                    // Xóa cookie cart
                    Cookies.remove('cart');

                    dispatch(setCart(mergedCart));
                } else {
                    dispatch(setCart(serverCart));
                }
            } else {
                const cookieCart = getCartFromCookie();
                if (cookieCart) {
                    dispatch(setCart(cookieCart));
                }
            }
        } catch (error) {
            console.error('Error syncing cart:', error);
        }
    };

    // Effect để đồng bộ cart khi component mount hoặc khi trạng thái đăng nhập thay đổi
    useEffect(() => {
        syncCartWithServer();
    }, [isAuthenticated]);

    // Effect để lưu cart vào cookie khi chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated && state.items.length > 0) {
            saveCartToCookie(state);
        }
    }, [state, isAuthenticated]);

    // Effect để lưu cart lên server khi đã đăng nhập
    useEffect(() => {
        if (isAuthenticated && state.items.length > 0) {
            cartApi.updateCart(state).catch(error => {
                console.error('Error updating cart on server:', error);
            });
        }
    }, [state, isAuthenticated]);

    return (
        <CartContext.Provider
            value={{
                state,
                addToCart: handleAddToCart,
                removeFromCart: handleRemoveFromCart,
                updateQuantity: handleUpdateQuantity,
                clearCart: handleClearCart,
                totalItems: cartStats.totalItems,
                totalAmount: cartStats.totalAmount,
                itemCount: cartStats.itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};