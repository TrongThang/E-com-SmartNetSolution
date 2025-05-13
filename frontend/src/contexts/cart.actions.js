export const CART_ACTIONS = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    SET_CART: 'SET_CART',
    SYNC_CART: 'SYNC_CART',
    ADD_TO_CART_SUCCESS: 'ADD_TO_CART_SUCCESS',
    ADD_TO_CART_FAILURE: 'ADD_TO_CART_FAILURE',
    REMOVE_FROM_CART_SUCCESS: 'REMOVE_FROM_CART_SUCCESS',
    REMOVE_FROM_CART_FAILURE: 'REMOVE_FROM_CART_FAILURE',
    UPDATE_QUANTITY_SUCCESS: 'UPDATE_QUANTITY_SUCCESS',
    UPDATE_QUANTITY_FAILURE: 'UPDATE_QUANTITY_FAILURE',
    CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
    CLEAR_CART_FAILURE: 'CLEAR_CART_FAILURE',
    TOGGLE_SELECT_ITEM: 'TOGGLE_SELECT_ITEM',
    SELECT_ALL: 'SELECT_ALL',
    CLEAR_SELECTED: 'CLEAR_SELECTED',
    UPDATE_SELECTED: 'UPDATE_SELECTED',
    GET_SELECTED_ITEMS: 'GET_SELECTED_ITEMS',
};

// Action Creators
export const addToCart = (product) => ({
    type: CART_ACTIONS.ADD_TO_CART,
    payload: product,
});

export const addToCartSuccess = (cart) => ({
    type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
    payload: cart,
});

export const addToCartFailure = (error) => ({
    type: CART_ACTIONS.ADD_TO_CART_FAILURE,
    payload: error,
});

export const removeFromCart = (productId) => ({
    type: CART_ACTIONS.REMOVE_FROM_CART,
    payload: { id: productId },
});

export const removeFromCartSuccess = (cart) => ({
    type: CART_ACTIONS.REMOVE_FROM_CART_SUCCESS,
    payload: cart,
});

export const removeFromCartFailure = (error) => ({
    type: CART_ACTIONS.REMOVE_FROM_CART_FAILURE,
    payload: error,
});

export const updateQuantity = (productId, quantity) => ({
    type: CART_ACTIONS.UPDATE_QUANTITY,
    payload: { id: productId, quantity },
});

export const updateQuantitySuccess = (cart) => ({
    type: CART_ACTIONS.UPDATE_QUANTITY_SUCCESS,
    payload: cart,
});

export const updateQuantityFailure = (error) => ({
    type: CART_ACTIONS.UPDATE_QUANTITY_FAILURE,
    payload: error,
});

export const clearCart = () => ({
    type: CART_ACTIONS.CLEAR_CART,
});

export const clearCartSuccess = () => ({
    type: CART_ACTIONS.CLEAR_CART_SUCCESS,
});

export const clearCartFailure = (error) => ({
    type: CART_ACTIONS.CLEAR_CART_FAILURE,
    payload: error,
});

export const setCart = (cart) => ({
    type: CART_ACTIONS.SET_CART,
    payload: cart,
});

export const syncCart = () => ({
    type: CART_ACTIONS.SYNC_CART,
});

export const toggleSelectItem = (id) => ({
    type: CART_ACTIONS.TOGGLE_SELECT_ITEM,
    payload: id,
});

export const selectAll = () => ({
    type: CART_ACTIONS.SELECT_ALL,
});

export const clearSelected = () => ({
    type: CART_ACTIONS.CLEAR_SELECTED,
});

export const updateSelected = (id, selected) => ({
    type: CART_ACTIONS.UPDATE_SELECTED,
    payload: { id, selected },
});