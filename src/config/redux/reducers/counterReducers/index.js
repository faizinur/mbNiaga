import {
    INCREMENT,
    DECREMENT
} from '../../actions/types'

const initialState = {
    counter : 0,
};

const counterReducers = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT : 
        console.log('UPDATE INCREMENT COUNTER : ', action.payload)
        return {
            ...state,
            counter : state.counter + action.payload,
        }
        case DECREMENT : 
        console.log('UPDATE DECREMENT COUNTER : ', action.payload)
        return {
            ...state,
            counter : state.counter - action.payload,
        }
        default:
            return state;
    }
};

export default counterReducers;