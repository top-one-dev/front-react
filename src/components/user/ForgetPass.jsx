import React, { Component }  from 'react';
import './user.css';
import { Link } from 'react-router-dom'
import { Form } from 'react-final-form'
import { Field } from 'react-final-form-html5-validation'

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import {TextField} from 'final-form-material-ui';
 
class ForgetPass extends Component {
  
  submit(values) {
  	alert(JSON.stringify(values, 0, 2));
  }

  render() {
    return (
    	<div className="user-form" >    		
			<div>
				<img src={require('../../assets/img/brand.png')} alt="brand" width="200" />
			</div>   				
			<Form
			    onSubmit={this.submit}
			    render={({ handleSubmit, submitting, pristine, values }) => (
			      <form onSubmit={handleSubmit}>
				      <FormGroup>
				      	<br />
				      	<Typography component="h4" variant="subheading" gutterBottom>
				          We will send a code to recover your password.
				        </Typography>
				      	<br />
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
						<br />
						<Button variant="contained" color="primary" disabled={submitting} type="submit" >
							Send Code
						</Button>
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

export default ForgetPass;