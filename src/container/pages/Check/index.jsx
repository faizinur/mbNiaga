import React, { Component, useEffect, useState } from 'react';
import {
	Page,
	List,
	ListItem,
	CardContent,
	Icon
} from 'framework7-react';

import { navigate } from '../../../config/redux/actions/routerActions';
import { log } from '../../../utils/';
import { useDispatch, useSelector } from "react-redux";
import { DefaultNavbar } from '../../../components/atoms'

const Check = (props) => {
	useEffect(() => {
		log('MOUNT OR UPDATE Check');
		setLoginResult('loginResult' in props ? props.loginResult : [])
		return () => {
			setLoginResult([])
			log('UNMOUNT Check');
		}
	}, []);
	const dispatch = useDispatch();
	let [ loginResult, setLoginResult ] = useState([]);
	return (
		<Page noToolbar noNavbar>
			<DefaultNavbar
				mode="info"
                onClick={()=> props.onClick()}
				backLink
				title={'title' in props ? props.title : 'null'}
			/>
			<CardContent padding={false}>
				<List medial-list style={{ marginRight: 20, marginLeft: 20, fontSize: 12 }}>
					<ListItem style={{ color: 'white', backgroundColor: loginResult.includes('MobileData') ? '#c0392b' : '#f96b55', flex: 1, flexDirection: 'row', marginBottom: 5 }} title="Mobile Data On">
						<Icon f7={loginResult.includes('MobileData') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon> {/* SUDAH */}
					</ListItem>
					<ListItem style={{ color: 'white', backgroundColor: loginResult.includes('Airplane') ? '#c0392b' : '#f96b55', flex: 1, flexDirection: 'row', marginBottom: 5 }} title="Airplane Mode On">
						<Icon f7={loginResult.includes('Airplane') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon>
					</ListItem>
					<ListItem style={{ color: 'white', backgroundColor: loginResult.includes('LoginTime') ? '#c0392b' : '#f96b55', flex: 1, flexDirection: 'row', marginBottom: 5 }} title="Login Jam 8 Pagi">
						<Icon f7={loginResult.includes('LoginTime') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon> {/* SUDAH */}
					</ListItem>
					<ListItem style={{ color: 'white', backgroundColor: loginResult.includes('DeviceTime') ? '#c0392b' : '#f96b55', flex: 1, flexDirection: 'row', marginBottom: 5 }} title="Jam Pada Perangkat Sesuai">
						<Icon f7={loginResult.includes('DeviceTime') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon> {/* SUDAH */}
					</ListItem>
					<ListItem style={{ color: 'white', backgroundColor: loginResult.includes('UserAuth') ? '#c0392b' : '#f96b55', flex: 1, flexDirection: 'row', marginBottom: 5 }} title="User ID dan Password Anda Sesuai">
						<Icon f7={loginResult.includes('UserAuth') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon> {/* SUDAH */}
					</ListItem>
					<ListItem style={{ color: 'white', backgroundColor: loginResult.includes('DeviceAuth') ? '#c0392b' : '#f96b55', flex: 1, flexDirection: 'row', marginBottom: 5 }} title="Device ID Anda Sesuai">
						<Icon f7={loginResult.includes('DeviceAuth') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon> {/* BELUM ADA KOLOMNYA DI DB */}
					</ListItem>
					<ListItem style={{ color: 'white', backgroundColor: loginResult.includes('ICCIDAuth') ? '#c0392b' : '#f96b55', flex: 1, flexDirection: 'row' }} title="ICCID Anda Sesuai">
						<Icon f7={loginResult.includes('ICCIDAuth') ? "xmark_rectangle_fiil" : "checkmark_rectangle"}></Icon> {/* BELUM ADA KOLOMNYA DI DB */}
					</ListItem>
				</List>
			</CardContent>
		</Page>
	)
}

export default Check;