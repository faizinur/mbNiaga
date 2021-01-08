import React, { Component } from 'react';
import {
	Page,
	Navbar,
	NavLeft,
	NavTitle,
	NavTitleLarge,
	NavRight,
	Link,
	Toolbar,
	Block,
	BlockTitle,
	List,
	ListItem,
	ListInput,
	Row,
	Col,
	Button
} from 'framework7-react';

import { connect } from 'react-redux';
// import { useDispatch, useSelector } from 'react-redux'
import { login, updateUser , setUser } from '../../../config/redux/actions/';
import { navigate } from '../../../config/redux/actions/routerActions';
import { log } from '../../../utils/consoles';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: 'Jhon Doe',
			password: '1234',
		};
	}

	componentDidMount() {
		// console.log("componentDidMount Home", this.props);
	};
	_onLogin = () => {
		this.props.onUpdateUser(
			{
				username: this.state.username,
				password: this.state.password,
			}
		);
		this.props.navigate('JHABJBASJDBASBD');
	}
	_onLogout = () => {
		this.props.setUser({})
	}
	render() {
		return (
			<Page name="home">
				{/* Top Navbar */}
				<Navbar large sliding={false}>
					<NavLeft>
						{/* <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" /> */}
					</NavLeft>
					<NavTitle sliding>mobCollNiaga</NavTitle>
					<NavRight>
						{/* <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" /> */}
					</NavRight>
					<NavTitleLarge>mobCollNiaga</NavTitleLarge>
				</Navbar>

				<BlockTitle>HELLO...</BlockTitle>
				<Block>
					<Row>
						<Col>
							<Button onClick={() => this._onLogout()} round>Logout</Button>
						</Col>
					</Row>
				</Block>
			</Page>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.main.user,
		profile: state.user.profile,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onUpdateUser: (data) => dispatch(updateUser(data)),
		navigate: (pageName) => dispatch(navigate(pageName)),
		setUser: (data) => dispatch(setUser(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);