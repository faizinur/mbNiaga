import React, { Component } from 'react';
import {
	Page,
	Navbar,
	List,
	ListInput,
	Block,
	Row,
	Col,
	Button
} from 'framework7-react';

import { connect } from 'react-redux';
import { navigate } from '../../../config/redux/actions/routerActions';
//import { log } from '../../../utils/consoles';

class InfoDebitur extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page noToolbar noNavbar>
				<List noHairlinesMd style={{ fontSize: 1 }}>
					<ListInput
						outline
						label="Customer Name"
						type="text"
					>
					</ListInput>
					<ListInput
						outline
						label="Card Number"
						type="text"
					>
					</ListInput>
					<ListInput
						outline
						label="Jenis Kelamin"
						type="text"
					>
					</ListInput>
					<ListInput
						outline
						label="DOB"
						type="text"
					>
					</ListInput>
				</List>
				<List>
					<Block strong>
						<Row>
							<Col width="50">
								<Button fill raised onClick={() => this._nextx()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Update Data</Button>
							</Col>
							<Col width="50">
								<Button fill raised onClick={() => this._nextx()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Rencana Kunjungan</Button>
							</Col>
						</Row>
						<Row style={{ marginTop: 20 }}>
							<Col width="100">
								<Button fill raised onClick={() => this._next()} style={{ backgroundColor: '#c0392b', fontSize: 12 }}>Next</Button>
							</Col>
						</Row>
					</Block>
				</List>
			</Page>
		);
	}
	_next = () => {
		this.props.navigate('/AddKunjungan/');
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.main.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		//onUpdateUser: (data) => dispatch(updateUser(data)),
		//onLogin: () => dispatch(login()),
		navigate: (nav) => dispatch(navigate(nav))
	};
};

export default connect(null, mapDispatchToProps)(InfoDebitur);