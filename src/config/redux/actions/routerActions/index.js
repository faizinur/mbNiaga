import { goBack, navigateTo, showAlert } from 'framework7-redux';
import { log } from '../../../../utils/';

const navigate = (pageName) => {
    if(pageName == '' || pageName == null) return false;
    return (dispatch, getState) => {
        log('navigate TO : ',pageName)
        dispatch(navigateTo(pageName));
        // dispatch(goBack());
    };
};

export {
    navigate,
}