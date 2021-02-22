import { goBack, navigateTo, showAlert } from 'framework7-redux';
import { log } from '../../../../utils/';
import { f7, ListGroup } from 'framework7-react';
const navigate = (pageName) => {
    if (pageName == '' || pageName == null) return false;
    return (dispatch, getState) => {
        log('navigate TO : ', pageName)
        dispatch(navigateTo(pageName));
        // dispatch(goBack());
    };
};

const back = () => {
    return (dispatch, getState) => {
        let pageCurrentName = document.getElementsByClassName('page-current')[0].dataset.name;
        if (document.getElementsByClassName('popup modal-in').length > 0) {
            log('ada pop up gak boleh back')
            return false;
        }
        let unRouteable = ['Login', 'SplashScreen', 'Main'];
        if (unRouteable.includes(pageCurrentName) || f7.views.main.router.history.length == 1) {
            log('gak boleh routing dari', pageCurrentName)
            return false;
        }
        //kasus tidak biasa yang routingnya bolak balik, atau halaman yang dipakai bersama
        switch (pageCurrentName) {
            case 'RencanaKunjungan':
            case 'ListDebitur':
            case 'RekapTerkirim':
            case 'RekapTertunda':
            case 'VisitedList':
            case 'DeviceInfo':
                while (f7.views.main.router.history.length) {
                    f7.views.main.router.history.pop();
                }
                dispatch(navigateTo('/Main/'));
                break;
            case 'InfoDebitur':
                dispatch(navigateTo('/ListDebitur/'));
                break;
            case 'AddKunjungan':
                dispatch(navigateTo(f7.views.main.router.history[f7.views.main.router.history.length - 2]));
                break;
            default: dispatch(goBack());
        }

    };
}

export {
    navigate,
    back,
}