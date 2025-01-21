import { useContext, useReducer, createContext } from 'react';
export const GlobalContext = createContext();

const initState = {
	books: []
};

const reducer = (state, action) => {
	
	switch (action.type) {
        case 'searchResult':
            return {
                ...state,
                books: action.payload
            };
		default:
			return state;
	}
};

const GlobalProvider = props => {
    const [ state, dispatch ] = useReducer(reducer, initState);
	return <GlobalContext.Provider value={[ state, dispatch ]} {...props} />;
};
export default GlobalProvider;

export const useGlobalContext = () => {

	return useContext(GlobalContext);
};
