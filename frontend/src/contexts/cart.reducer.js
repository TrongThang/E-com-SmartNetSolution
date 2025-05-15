import { CART_ACTIONS } from './cart.actions';

export const initialState = {
    items: [],
    total: 0,
    isLoading: false,
    error: null,
};

export const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.ADD_TO_CART:
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
                            : item
                    ),
                    total: state.total + (action.payload.price * (action.payload.quantity || 1)),
                };
            }
            return {
                ...state,
                items: [...state.items, { 
                    ...action.payload, 
                    quantity: action.payload.quantity || 1 
                }],
                total: state.total + (action.payload.price * (action.payload.quantity || 1)),
            };

        case CART_ACTIONS.REMOVE_FROM_CART:
            const itemToRemove = state.items.find(item => item.id === action.payload.id);
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id),
                total: state.total - (itemToRemove.price * itemToRemove.quantity),
            };

        case CART_ACTIONS.UPDATE_QUANTITY:
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
                total: state.items.reduce((total, item) => {
                    if (item.id === action.payload.id) {
                        return total + (item.price * action.payload.quantity);
                    }
                    return total + (item.price * item.quantity);
                }, 0),
            };

        case CART_ACTIONS.CLEAR_CART:
            return initialState;

        case CART_ACTIONS.SET_CART:
            return {
                ...state,
                items: action.payload.items || [],
                total: action.payload.total || 0,
            };

        case CART_ACTIONS.SYNC_CART:
            return {
                ...state,
                isLoading: true,
            };

        case CART_ACTIONS.ADD_TO_CART_SUCCESS:
        case CART_ACTIONS.REMOVE_FROM_CART_SUCCESS:
        case CART_ACTIONS.UPDATE_QUANTITY_SUCCESS:
            return {
                ...state,
                items: action.payload.items || [],
                total: action.payload.total || 0,
                isLoading: false,
                error: null,
            };

        case CART_ACTIONS.CLEAR_CART_SUCCESS:
            return {
                ...initialState,
                isLoading: false,
            };

        case CART_ACTIONS.ADD_TO_CART_FAILURE:
        case CART_ACTIONS.REMOVE_FROM_CART_FAILURE:
        case CART_ACTIONS.UPDATE_QUANTITY_FAILURE:
        case CART_ACTIONS.CLEAR_CART_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case CART_ACTIONS.TOGGLE_SELECT_ITEM:
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload ? { ...item, selected: !item.selected } : item
                ),
            };
        case CART_ACTIONS.SELECT_ALL:
            return {
                ...state,
                items: state.items.map(item => ({ ...item, selected: true })),
            };
        case CART_ACTIONS.CLEAR_SELECTED:
            return {
                ...state,
                items: state.items.map(item => ({ ...item, selected: false })),
            };
        case CART_ACTIONS.UPDATE_SELECTED:
            return { 
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? { ...item, selected: action.payload.selected } : item
                ),
            };
        default:
            return state;
    }
};