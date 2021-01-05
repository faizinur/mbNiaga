import React from 'react';
import { Page, Navbar, Block, List, ListItem } from 'framework7-react';

import { connect } from 'react-redux';

class RequestAndLoad extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: props.f7route.context.user,
		};

	}
	componentDidMount(){
	  console.log('componentDidMount Request And Load')
	};
	
	render() {
		const user = this.state.user;
		return (
			<Page>
				<Navbar title={`${'HELLO WORLD!'}`} backLink="Back" />
				<Block strong>
					{JSON.stringify(this.props.user)}
				</Block>
				{/* <List>
					{user.links.map((link, index) => (
						<ListItem
							key={index}
							link={link.url}
							title={link.title}
							external
							target="_blank"
						></ListItem>
					))}
				</List> */}
			</Page>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.main.user,
	};
};

export default connect(mapStateToProps, null)(RequestAndLoad);