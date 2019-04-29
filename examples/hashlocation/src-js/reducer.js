const initialState = {
    items: ['alpha', 'bravo', 'charlie'],
    current: 0
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GOTO_ITEM':
            return { ...state, current: action.payload };
        default:
            return state;
    }
};
export default reducer;
