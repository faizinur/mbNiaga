import React, { Component } from 'react';
import {
	Page,
	Block,
	List,
	ListInput,
	Row,
	Col,
	Button,
} from 'framework7-react';

import { connect } from 'react-redux';
import { login, updateUser, setUser, navigate } from '../../../config/redux/actions/';
import { log } from '../../../utils/consoles';
import { POST } from '../../../utils/API/';
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: 'Jhon Doe',
			password: '1234',
		};
	}

	componentDidMount() {
		// console.log("componentDidMount Login", this.props.profile);
	};
	_onLogin = () => {
		const { username, password } = this.state;
		// this.props.navigate('/select/');
		// if(username == '' || password == ''){return false;}
		var user = {
			nip: username,
			password: password,
		}
		POST(`Login`, user)
			.then(res => {
				// log(res)
				this.props.setUser({
					username: username,
					password: password,
				});
			})
			.catch(err => log(err));
	}

	render() {
		return (
			<Page name="login">
				<List noHairlinesMd>
					<ListInput
						label="Name"
						type="text"
						placeholder="Your name"
						clearButton
						onChange={({ target }) => this.setState({ password: target.value })}
					/>
					<ListInput
						label="Password"
						type="text"
						placeholder="Your password"
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
		profile: state.user.profile,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		navigate: (pageName) => dispatch(navigate(pageName)),
		setUser: (data) => dispatch(setUser(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);