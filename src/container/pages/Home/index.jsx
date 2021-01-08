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
import { login, updateUser, setUser } from '../../../config/redux/actions/';
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
				<Navbar sliding={false}>
					<NavLeft>
						<Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" />
					</NavLeft>
					<NavTitle sliding>mobCollNiaga</NavTitle>
					<NavRight>
						<Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" />
					</NavRight>
				</Navbar>

				<BlockTitle>HELLO... {this.props.profile.username}</BlockTitle>

				<Block style={{ margin: 0, padding: 0 }}>
					<Row noGap>
						<Col width="30" medium="30">
							<List noHairlinesMd style={{ margin: 0, padding: 0 }}>
								<ListInput
									label="Name"
									type="text"
									placeholder="Your name"
									clearButton
									outline
								/>
							</List>
						</Col>
						<Col width="70" medium="70">
							<List noHairlinesMd style={{ margin: 0, padding: 0 }}>
								<ListInput
									label="Name"
									type="text"
									placeholder="Your name"
									clearButton
									outline
								/>
							</List>
						</Col>
					</Row>
				</Block>


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