import { goBack, navigateTo, showAlert } from 'framework7-redux';
import { log } from '../../../../utils/';

const navigate = (pageName) => {
    return (dispatch, getState) => {
        log('navigate TO : ',pageName)
        dispatch(navigateTo(pageName));
        // dispatch(goBack());
    };
};

export {
    navigate,
}