import React from 'react';
import { Spinner } from 'reactstrap';

class Loader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show:false
		}
	}

	componentDidMount() {
		if(this.props.show){
			this.setState({show:this.props.show})
		}
	}

	render() {

		return (
			<div hidden={(this.props.show)?false:true}>
				<Spinner style={{ width: '3rem', height: '3rem',zIndex: '1000',position: 'absolute',left: '47%',top: '35%'}}  color="primary" />
				<div className="custom-backdrop"></div>
		   </div>
		);
	}
}

export default Loader;
