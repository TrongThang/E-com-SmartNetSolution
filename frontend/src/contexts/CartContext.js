import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import cartApi from '@/apis/modules/cart.api.ts';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
import productApi from '@/apis/modules/product.api.ts';

const CartContext = createContext();

// Hàm quản lý ảnh trong localStorage
const imageStorage = {
    saveImage: (productId, image) => {
        try {
            localStorage.setItem(`product_image_${productId}`, image);
        } catch (error) {
            console.error('Error saving image to localStorage:', error);
        }
    },

    getImage: (productId) => {
        return localStorage.getItem(`product_image_${productId}`);
    },

    removeImage: (productId) => {
        localStorage.removeItem(`product_image_${productId}`);
    },

    clearImages: () => {
        const cart = getCartFromCookie();
        if (cart && Array.isArray(cart.items)) {
            cart.items.forEach(item => {
                localStorage.removeItem(`product_image_${item.id}`);
            });
        }
    }
};

// Hàm lấy cart từ cookie
const getCartFromCookie = () => {
    try {
        const cartCookie = Cookies.get('cart');
        if (cartCookie) {
            const cart = JSON.parse(cartCookie);
            // Kiểm tra và đảm bảo cart có cấu trúc hợp lệ
            if (cart && Array.isArray(cart.items)) {
                // Thêm ảnh từ localStorage vào mỗi sản phẩm
                cart.items = cart.items.map(item => ({
                    ...item,
                    image: imageStorage.getImage(item.id)
                }));
                return cart;
            }
        }
        // Trả về object mặc định thay vì null
        return { items: [], total: 0 };
    } catch (error) {
        console.error('Error getting cart from cookie:', error);
        return { items: [], total: 0 };
    }
};

// Hàm lưu cart vào cookie
const saveCartToCookie = (cart) => {
    try {
        if (!cart || !Array.isArray(cart.items)) {
            console.error('Invalid cart data:', cart);
            return;
        }

        // Lưu ảnh vào localStorage
        cart.items.forEach(item => {
            if (item.image) {
                imageStorage.saveImage(item.id, item.image);
            }
        });

        // Chỉ lưu thông tin cơ bản vào cookie
        const simplifiedCart = {
            items: cart.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price || item.selling_price,
                quantity: item.quantity,
                selected: item.selected || false,
                status: item.status,
            })),
            total: cart.total
        };

        const cartString = JSON.stringify(simplifiedCart);
        Cookies.set('cart', cartString, {
            expires: 7,
            path: '/',
        });
    } catch (error) {
        console.error('Error saving cart to cookie:', error);
    }
};

export const CartProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [cart, setCart] = useState({
        items: [],
        total: 0
    });
    const [isInitialized, setIsInitialized] = useState(false);

    // Hàm lấy thông tin mới nhất của sản phẩm từ server
    const fetchLatestProductInfo = async (productIds) => {
        try {
            const filters = {
                "logic": "and",
                "filters": [
                    {
                        "field": "id",
                        "condition": "in",
                        "value": productIds
                    }
                ]
            };

            if (user && user.customer.customer_id) {
                filters.filters.push({
                    "field": "customer_id",
                    "condition": "=",
                    "value": user.customer.customer_id
                })
                const response = await cartApi.getByIdCustomer(user.customer.customer_id);
                
                return response.data || [];
            } else {
                console.log('filters', filters)
                const response = await cartApi.fetchLatestProductInfo({
                    filters: filters
                });
                return response.data.data || [];
            }
        } catch (error) {
            console.error('Error fetching latest product info:', error);
            return [];
        }
    };

    // Khởi tạo cart
    const initializeCart = async () => {
        try {
            if (isAuthenticated) {
                const serverCart = await cartApi.getByIdCustomer(user.customer_id);
                if (serverCart && serverCart.data) {
                    const items = serverCart.data.map(item => ({
                        ...item,
                        id: item.id,
                        image: item.image,
                        name: item.name,
                        price: item.selling_price,
                        status: item.status,
                        stock: item.stock,
                        delta: item.delta,
                        quantity: item.quantity,
                        selected: item.selected
                    }));

                    setCart({
                        items: items,
                        total: items?.reduce((total, item) => total + (item.selling_price * item.quantity), 0)
                    });
                } else {
                    setCart({
                        items: [],
                        total: 0
                    });
                }
            } else {
                const cookieCart = getCartFromCookie();
                // Đảm bảo cookieCart luôn có cấu trúc hợp lệ
                if (cookieCart && Array.isArray(cookieCart.items) && cookieCart.items.length > 0) {
                    const latestProducts = await fetchLatestProductInfo(
                        cookieCart.items.map(item => item.id)
                    );

                    const updatedItems = cookieCart.items.map(item => {
                        const latestProduct = latestProducts.find(p => p.id === item.id);
                        return latestProduct ? {
                            ...item,
                            name: latestProduct.name,
                            price: latestProduct.selling_price,
                            status: latestProduct.status,
                            stock: latestProduct.stock,
                            delta: latestProduct.delta,
                            quantity: item.quantity,
                            selected: item.selected
                        } : item;
                    });

                    const newCart = {
                        items: updatedItems,
                        total: updatedItems.reduce(
                            (total, item) => total + (item.price * item.quantity),
                            0
                        )
                    };
                    setCart(newCart);
                } else {
                    // Nếu không có cart hoặc cart rỗng, set cart mặc định
                    setCart({ items: [], total: 0 });
                }
            }
        } catch (error) {
            console.error('Error initializing cart:', error);
            // Trong trường hợp lỗi, set cart mặc định
            setCart({ items: [], total: 0 });
        } finally {
            setIsInitialized(true);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async (product) => {
        try {
            const check_warehouse_inventory = await productApi.checkWarehouseInventory(product.id);

            if (check_warehouse_inventory.data.is_enough === false) {
                const htmlText = `Sản phẩm <b class="text-red-500">${check_warehouse_inventory.data.product_name.toUpperCase()}</b> ${check_warehouse_inventory.data.stock <= 0 ? "đã hết hàng" : `chỉ còn <b class="text-red-500">${check_warehouse_inventory.data.stock || 0}</b> sản phẩm và bạn đã thêm đủ <b class="text-red-500">${product.quantity}</b> sản phẩm`}`

                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    html: htmlText
                })
                return;
            }

            if (isAuthenticated) {
                const response = await cartApi.addToCart(user.customer_id, product.id, product.quantity);

                if (response.status_code !== 200) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: response.errors[0].message,
                    })
                }   
            }
            
            setCart(prevCart => {
                // Đảm bảo prevCart và prevCart.items luôn tồn tại
                const currentCart = prevCart || { items: [], total: 0 };
                const currentItems = currentCart.items || [];
                
                const existingItem = currentItems.find(item => item.id === product.id);
                let updatedItems;

                if (existingItem) {
                    updatedItems = currentItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    // Sử dụng currentItems thay vì prevCart?.items
                    updatedItems = [...currentItems, { ...product, quantity: 1, selected: true }];
                }

                const newCart = {
                    items: updatedItems,
                    total: updatedItems.reduce(
                        (total, item) => total + (item.price * item.quantity),
                        0
                    )
                };

                if (!isAuthenticated) {
                    saveCartToCookie(newCart);
                }

                return newCart;
            });

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Thêm sản phẩm vào giỏ hàng thành công',
            })
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Cập nhật số lượng sản phẩm
    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            if (isAuthenticated) {
                await cartApi.updateQuantity(user.customer_id, productId, quantity);
            }

            setCart(prevCart => {
                const updatedItems = prevCart.items.map(item =>
                    item.id === productId
                        ? { ...item, quantity }
                        : item
                );

                const newCart = {
                    items: updatedItems,
                    total: updatedItems.reduce(
                        (total, item) => total + (item.price * item.quantity),
                        0
                    )
                };

                if (!isAuthenticated) {
                    saveCartToCookie(newCart);
                }

                return newCart;
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveFromCart = async (productId) => {
        try {
            if (isAuthenticated) {
                const response = await cartApi.removeFromCart(user.customer_id, productId);
                
            }

            setCart(prevCart => {
                const updatedItems = prevCart.items.filter(item => item.id !== productId);
                const newCart = {
                    items: updatedItems,
                    total: updatedItems.reduce(
                        (total, item) => total + (item.price * item.quantity),
                        0
                    )
                };

                if (!isAuthenticated) {
                    saveCartToCookie(newCart);
                    imageStorage.removeImage(productId);
                }

                return newCart;
            });
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    // Xóa toàn bộ giỏ hàng
    const handleClearCart = async () => {
        try {
            if (isAuthenticated) {
                await cartApi.removeAllFromCart(user.customer_id);
            } else {
                Cookies.remove('cart');
                imageStorage.clearImages();
            }
            setCart({ items: [], total: 0 });
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    // Các hàm xử lý chọn sản phẩm
    const toggleSelectItem = (id) => {
        setCart(prevCart => {
            // Đảm bảo prevCart có cấu trúc hợp lệ
            if (!prevCart || !Array.isArray(prevCart.items)) {
                return { items: [], total: 0 };
            }

            const updatedCart = {
                ...prevCart,
                items: prevCart.items.map(item =>
                    item.id === id
                        ? { ...item, selected: !item.selected }
                        : item
                )
            };

            if (!isAuthenticated) {
                saveCartToCookie(updatedCart);
            }
            return updatedCart;
        });
    };

    const selectAll = () => {
        setCart(prevCart => {
            if (!prevCart || !Array.isArray(prevCart.items)) {
                return { items: [], total: 0 };
            }

            const updatedCart = {
                ...prevCart,
                items: prevCart.items.map(item => ({ ...item, selected: true }))
            };

            if (!isAuthenticated) {
                saveCartToCookie(updatedCart);
            }
            return updatedCart;
        });
    };

    const clearSelected = () => {
        setCart(prevCart => {
            if (!prevCart || !Array.isArray(prevCart.items)) {
                return { items: [], total: 0 };
            }

            const updatedCart = {
                ...prevCart,
                items: prevCart.items.map(item => ({ ...item, selected: false }))
            };

            if (!isAuthenticated) {
                saveCartToCookie(updatedCart);
            }
            return updatedCart;
        });
    };

    const removeSelected = () => {
        setCart(prevCart => {
            if (!prevCart || !Array.isArray(prevCart.items)) {
                return { items: [], total: 0 };
            }

            const updatedItems = prevCart.items.filter(item => !item.selected);
            const newCart = {
                items: updatedItems,
                total: updatedItems.reduce(
                    (total, item) => total + (item.price * item.quantity),
                    0
                )
            };

            if (!isAuthenticated) {
                saveCartToCookie(newCart);
            } else {
                cartApi.removeSelected(user.customer_id, prevCart.items);
            }

            return newCart;
        });
    };

    // Lấy danh sách sản phẩm đã chọn
    const getItemSelected = () => {
        if (!cart || !Array.isArray(cart.items)) {
            return [];
        }
        return cart.items.filter(item => item.selected);
    };

    // Tính toán các thống kê từ cart
    const cartStats = useMemo(() => (
        {
        totalItems: cart?.items?.length || 0,
        totalAmount: cart?.total,
        itemCount: cart?.items?.length,
    }), [cart]);

    // Effect khởi tạo cart
    useEffect(() => {
        initializeCart();
    }, []);

    // Effect đồng bộ với server khi đăng nhập
    useEffect(() => {
        if (isAuthenticated && cart?.items?.length > 0) {
            initializeCart()
            cartApi.updateCart(user.customer_id, cart).catch(console.error);
        } else if (!isAuthenticated) {
            // Đảm bảo có cart hợp lệ khi không đăng nhập
            const cookieCart = getCartFromCookie();
            setCart(cookieCart || { items: [], total: 0 });
        }
    }, [isAuthenticated]);


    return (
        <CartContext.Provider
            value={{
                cart,
                isInitialized,
                addToCart: handleAddToCart,
                removeFromCart: handleRemoveFromCart,
                updateQuantity: handleUpdateQuantity,
                clearCart: handleClearCart,
                toggleSelectItem,
                selectAll,
                clearSelected,
                removeSelected,
                getItemSelected,
                ...cartStats,
                initializeCart
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