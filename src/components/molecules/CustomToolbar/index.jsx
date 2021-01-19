import React, { useEffect, useState } from 'react'
import {
    Toolbar,
    Link,
    f7,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { setUser, navigate } from '../../../config/redux/actions/';
import { log, POST } from '../../../utils';

const CustomToolbar = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE CustomToolbar');
        return () => {
            log('UNMOUNT CustomToolbar');
        }
    }, [profile]);
    const dispatch = useDispatch();
    const [tablinkActive, setTablinkActive] = useState(0);
    const profile = useSelector(state => state.user.profile)
    const _setTablink = (index) => {
        let currentRoute = f7.views.main.router.history[f7.views.main.router.history.length - 1];
        if (currentRoute == '/Main/' && index == 0) return false;
        if (currentRoute == '/UpdatePin/' && index == 1) return false;
        log('clicked index', index)
        setTablinkActive(index)
        switch (index) {
            case 0:
                dispatch(navigate('/Main/'));
                setTablinkActive(index)
                break;
            case 1:
                dispatch(navigate('/UpdatePin/'));
                setTablinkActive(index)
                break;
            case 2:
                let prevState = tablinkActive;
                setTablinkActive(index);
                f7.dialog.confirm(
                    'Apakah anda yakin ingin keluar?',
                    () => {
                        f7.dialog.prompt(
                            'Harap masukkan username anda.',
                            (data) =>
                                POST(`Logout`, { username: data })
                                    .then(res => {
                                        log(res.status);
                                        if (res.status == 'success') {
                                            dispatch(setUser({}));
                                            dispatch(navigate('/'));
                                            setTablinkActive(index);
                                        } else {
                                            setTablinkActive(prevState);
                                        }
                                    })
                                    .catch(err => log("LOGOUT", err) && setTablinkActive(prevState))
                            ,
                            () =>
                                setTablinkActive(prevState))
                    },
                    () =>
                        setTablinkActive(prevState)
                )
                break;
            default:
        }
    }
    return (
        <div
            style={{
                width: '100%',
                height: 56,
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: 9999,
                display: props.shown == true ? 'none' : 'block'
            }}>
            <Toolbar tabbar bottom labels>
                <Link
                    onClick={(e) => _setTablink(0)}
                    tabLink={true}
                    text="MENU"
                    iconIos="f7:menu"
                    iconAurora="f7:menu"
                    iconMd="material:menu"
                    tabLinkActive={tablinkActive == 0} />
                <Link
                    onClick={(e) => _setTablink(1)}
                    tabLink={true}
                    text="UBAH PIN"
                    iconIos="f7:lock"
                    iconAurora="f7:lock"
                    iconMd="material:lock"
                    tabLinkActive={tablinkActive == 1} />
                <Link
                    onClick={(e) => _setTablink(2)}
                    tabLink={true}
                    text="KELUAR"
                    iconIos="f7:arrow_right_to_line_alt"
                    iconAurora="f7:arrow_right_to_line_alt"
                    iconMd="material:exit_to_app"
                    tabLinkActive={tablinkActive == 2} />
            </Toolbar>
        </div>
    )
}

export default CustomToolbar;
