import React, { Component }  from 'react';
import './user.css';
import { Link } from 'react-router-dom';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form-html5-validation';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {TextField, Checkbox} from 'final-form-material-ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import Message from '../share/Message'; 
import AuthService from '../services/AuthService';

 
class LogIn extends Component {

	constructor(props) {
		super(props);

		this.state = {
			type 			: 'error',
			open 			: false,
			message 	: '',
			loading 	: false,
		};

		this.submit = this.submit.bind(this);
		this.Auth = new AuthService();
	}

	componentWillMount(){
		if(this.Auth.loggedIn())
			this.props.history.push(`/user/${this.Auth.getProfile().user_id}`);
	}

	submit(values) {

		let _this = this;
		this.setState({ loading: true });
		
		this.Auth.login(values.email, values.password)
			.then(res =>{

				_this.setState({ message: 'Congratulation! Logged In Successfully.', open: true, type: 'success' })				
				setTimeout(function() {
					_this.props.history.push(`/user/${_this.Auth.getProfile().user_id}`);
					window.location.reload();
				}, 1500);

			})
			.catch(err =>{
				setTimeout(function() {
					_this.setState({ message: 'Email or Password are incorrect !', open: true, type: 'error', loading: false })
				}, 1000);				
			})
	}

	render() {

		const responseGoogle = (response) => {
			console.log(response);
			let _this = this;
			let token = response.Zi;
			if(response.Zi){
				this.setState({ loading: true });
			
				this.Auth.login_with_google(token)
					.then(res => {
						this.setState({ message: 'Congratulation! Logged In Successfully.', open: true, type: 'success' })				
						setTimeout(function() {
							_this.props.history.push(`/user/${_this.Auth.getProfile().user_id}`);
							window.location.reload();
						}, 1500);
					})
					.catch(err => {
						setTimeout(function() {
							_this.setState({ message: 'Email or Password are incorrect !', open: true, type: 'error', loading: false })
						}, 1000);	
					})
			}			
		}

		const responseFacebook = (response) => {
			let _this = this;
			let token = response.accessToken;
			if(token){
				this.setState({ loading: true });			
				this.Auth.login_with_facebook(token)
					.then(res => {
						this.setState({ message: 'Congratulation! Logged In Successfully.', open: true, type: 'success' })				
						setTimeout(function() {
							_this.props.history.push(`/user/${_this.Auth.getProfile().user_id}`);
							window.location.reload();
						}, 1500);
					})
					.catch(err => {
						setTimeout(function() {
							_this.setState({ message: 'Email or Password are incorrect !', open: true, type: 'error', loading: false })
						}, 1000);	
					})
			}
		}

		const responseLinkedin = (response) => {
			let _this = this;
			let code 	= response.code
			if(code){
				this.setState({ loading: true });			
				this.Auth.login_with_linkedin(code)
					.then(res => {
						this.setState({ message: 'Congratulation! Logged In Successfully.', open: true, type: 'success' })				
						setTimeout(function() {
							_this.props.history.push(`/user/${_this.Auth.getProfile().user_id}`);
							window.location.reload();
						}, 1500);
					})
					.catch(err => {
						setTimeout(function() {
							_this.setState({ message: "An error, please use other signup option.", open: true, type: 'error', loading: false })
						}, 1000);	
					})
			}
		}

		return (
			<div className="user-form">
				<div>
					<img src={require('../../assets/img/brand.png')} alt="brand" width="200" />
				</div>
				<Message
					type={this.state.type}
					message={this.state.message}
					open={this.state.open}
				/>
        { this.state.loading 
					? <CircularProgress className="login-loading" color="primary" />
					: <Form
							onSubmit={this.submit}
							render={({ handleSubmit, submitting, pristine, values }) => (
								<form onSubmit={handleSubmit}>
									<FormGroup>
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
										<br />			

										<FormControlLabel
											control={
												<Field
													name="remember"
													component={Checkbox}
													type="checkbox"
													color="primary" />
												}
											label="Remember me"
										/> 
										<br /> 
										<Button variant="contained" color="primary" disabled={submitting} type="submit" >LogIn</Button>
										<br />
										<GoogleLogin
											clientId="xxx.apps.googleusercontent.com"
											buttonText="Login With Google"
											onSuccess={responseGoogle}
											onFailure={responseGoogle}
											className="google-button" />
										<FacebookLogin
											appId="xxx"
											fields="name,email"
											callback={responseFacebook} 
											icon="fa-facebook"
											cssClass="facebook-button"
										/>
										<LinkedIn
											clientId="xxx"
											onFailure={responseLinkedin}
											onSuccess={responseLinkedin}
											redirectUri="https://localhost:4000/linkedin"
										>
											<i className="fa fa-linkedin" ></i>
											Login With LinkedIn
										</LinkedIn>
										<br />
										<Link to="/signup" className="btn btn-default pull-right" >Create New Account</Link>
										<br />				
										<Link to="/forgetpass" >Forget Password?</Link>
									</FormGroup>
								</form> 
						)}
					/>				
			}
		</div>
		)
	}
}

export default LogIn;