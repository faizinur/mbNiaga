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
	Button,
	Card,
} from 'framework7-react';

import { connect } from 'react-redux';
// import { useDispatch, useSelector } from 'react-redux'
import { login, updateUser, setUser } from '../../../config/redux/actions/';
import { navigate } from '../../../config/redux/actions/routerActions';


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
					<form id="myForm">
						<Row noGap>
							<Col width="100" medium="100">
								<List noHairlinesMd style={{ margin: 0, padding: 0 }}>
									<ListInput
										label="Validation"
										type="text"
										clearButton
										outline
										placeholder="Input Text"
										required
										pattern="[A-Za-z]{4}"
										validate
										onValidate={(isValid) => console.log('Validation', isValid)}
										errorMessageForce={false}
										errorMessage="Harap isi Input"
										ignoreStoreData={true}
									/>
								</List>
							</Col>
							<Col width="100" medium="100">
								<List noHairlinesMd style={{ margin: 0, padding: 0 }}>
									<ListInput
										label="Password"
										type="password"
										clearButton
										outline
										placeholder="Input Password"
										required
										validate
										pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
										validate
										onValidate={(isValid) => console.log('password', isValid)}
										errorMessageForce={false}
										errorMessage="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
									/>
								</List>
							</Col>
						</Row>
					</form>
				</Block>
				<Block style={{ margin: 0, padding: 0 }}>
					<a href="">
						<Card
							title="Card header"
							content="Card with header and footer. Card headers are used to display card titles and footers for additional information or just for custom actions."
							footer="Card footer"
						></Card>
					</a>
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