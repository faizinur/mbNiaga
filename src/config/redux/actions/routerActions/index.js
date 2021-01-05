import { goBack, navigateTo, showAlert } from 'framework7-redux';

const navigate = (pageName) => {
    return (dispatch, getState) => {
        dispatch(navigateTo(pageName));
        // dispatch(goBack());
    };
};

export {
    navigate,
}