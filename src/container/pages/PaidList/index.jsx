import React, { Component, useEffect, useState } from 'react';
import {
	Page,
} from 'framework7-react';

import { navigate } from '../../../config/redux/actions/routerActions';
import { log, Connection, SQLite, SQLiteTypes, Filter } from '../../../utils';
import { useDispatch, useSelector } from "react-redux";
import { DefaultNavbar } from '../../../components/atoms';
import { SystemInfo } from '../../../components/molecules';

const PaidList = (props) => {
	useEffect(() => {
		log('MOUNT OR UPDATE visitedList');
		return () => {
			log('UNMOUNT visitedList');
		}
	}, []);
	const dispatch = useDispatch();
	return (
		<Page noToolbar noNavbar style={{ paddingBottom: 60 }} name="PaidList" backLink>
			<DefaultNavbar
				title={'Paid List'}
				network={Connection()}
				backLink
			/>
			<SystemInfo />
		</Page>
	)
}

export default PaidList;