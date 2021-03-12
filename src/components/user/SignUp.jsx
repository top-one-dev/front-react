import React, { Component }  from 'react';
import './user.css';
import { Link } from 'react-router-dom';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form-html5-validation';

import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import {TextField} from 'final-form-material-ui';
import Message from '../share/Message';

import API from '../services/Api';
 
class SignUp extends Component {

	constructor(props) {
		super(props);

		this.state = {
			type: 'error',
			open: false,
			message: ''
		};

		this.submit = this.submit.bind(this);
	}
  
	submit(values) {
		let _this = this;
		API.post('signup', values )
			.then(res => {
				_this.setState({ message: res.data.message, open: true, type: 'success' })
				setTimeout(function() {
					_this.props.history.push('/login')
				}, 3000);
			})
			.catch(function (error) {
				Object.assign({}, error).response.status === 422
				? _this.setState({ message: (Object.assign({}, error).response.data.message), open: true, type: 'error' })
				: console.log(Object.assign({}, error))
			});
	}

	render() {
		return (
		<div className="user-form" >    		
			<div>
			<img src={require('../../assets/img/brand.png')} alt="brand" width="200" />
			</div>
			<Message
				type={this.state.type}
				message={this.state.message}
				open={this.state.open}
			/>
			<Form
				onSubmit={this.submit}
				render={({ handleSubmit, submitting, pristine, values }) => (
									<form onSubmit={handleSubmit}>
										<FormGroup>
											<Field
												name="name"
												component={TextField}
												type="text"
												maxLength={20}
												tooLong="That name is too long!"
												pattern="[A-Z].+"
												patternMismatch="Name is not correct format. eg: John"
												label="Name"
												margin="normal"
												required						            
											/>
											<Field
												name="email"
												component={TextField}
												type="email"
												typeMismatch="That's not an email address"
												label="Email"
												autoComplete="email"
												margin="normal"
												required
											/>
											<Field
												name="password"
												component={TextField}
												type="password"								
												label="Password"
												autoComplete="current-password"
												margin="normal"
												required
											/>
											<Field
												name="password_confirmation"
												component={TextField}
												type="password"								
												label="Password Confirmation"
												autoComplete="current-password"
												margin="normal"
												required
											/>
											<br />
											<Button variant="contained" color="primary" disabled={submitting} type="submit" >SignUp</Button>
											<br />
											<Link to="/login" className="btn btn-default pull-right" >Log In</Link>
										</FormGroup>
									</form> 
								)}
			/>
		</div>
		)
	}
}

export default SignUp;