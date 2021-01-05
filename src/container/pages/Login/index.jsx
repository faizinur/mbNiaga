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
import { login, updateUser } from '../../../config/redux/actions/mainActions';
import { navigate } from '../../../config/redux/actions/routerActions';
import { log } from '../../../utils/consoles';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: 'Jhon Doe',
			password: '1234',
		};
	}

	componentDidMount() {
		// console.log("componentDidMount Login", this.props);
	};
	_onLogin = () => {
        this.props.navigate('/select/');
	}

	render() {
		return (
			<Page name="login">
				<p>Hayo Login Dulu</p>
				<List noHairlinesMd>
					<ListInput
						label="Name"
						type="text"
						placeholder="Your name"
						clearButton
						value={""}
						onChange={({ target }) => this.setState({ password: target.value })}
					/>
					<ListInput
						label="Password"
						type="text"
						placeholder="Your password"
						value={""}
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
	return state;
};

const mapDispatchToProps = (dispatch) => {
	return {
		navigate: (pageName) => dispatch(navigate(pageName)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);