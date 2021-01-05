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
import { login, updateUser } from '../../../config/redux/actions/mainActions';
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

				<BlockTitle>Navigation</BlockTitle>

				<List noHairlinesMd>
					<ListInput
						label="Name"
						type="text"
						placeholder="Your name"
						clearButton
						value={this.props.user.username}
						onChange={({ target }) => this.setState({ password: target.value })}
					/>
					<ListInput
						label="Password"
						type="text"
						placeholder="Your password"
						value={this.props.user.password}
						clearButton
						onChange={({ target }) => this.setState({ username: target.value })}
					/>
				</List>
				<Block>
					<Row>
						<Col>
							<Button onClick={() => this._onLogin()} round>Login</Button>
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onUpdateUser: (data) => dispatch(updateUser(data)),
		navigate: (pageName) => dispatch(navigate(pageName)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);