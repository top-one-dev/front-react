import React, { Component }  from 'react';
import './user.css';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form-html5-validation';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Avatar from 'react-avatar-edit'
import Modal from 'react-modal';
import { TagsSelect } from 'react-select-material-ui';
import Grid from '@material-ui/core/Grid';
import {TextField} from 'final-form-material-ui';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Message from '../share/Message';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const avatarModalStyle = {
	overlay: {
		bottom: '-20px',
			backgroundColor: 'rgba(0, 0, 0, 0.75)'
		},
		content: {
			top						: '50%',
			left					: '50%',
			right					: 'auto',
			bottom				: 'auto',
			marginRight		: '-50%',
			transform			: 'translate(-50%, -50%)',
			textAlign			: 'center',
			borderRadius	:	'3px',
			minWidth			: '350px'
		}
	};

Modal.setAppElement('#root')

 
class EditProfile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			modalIsOpen: 		false,
			preview: 				null,
			messageType: 		'error',
			messageOpen: 		false,
			messageText: 		'',
			loading: 				true,
			data: 					{},
			options: 				[],			
		};

		this.openModal 				= this.openModal.bind(this);
		this.afterOpenModal 	= this.afterOpenModal.bind(this);
		this.closeModal 			= this.closeModal.bind(this);
		this.saveAvatar 			= this.saveAvatar.bind(this);

		this.onCrop 					= this.onCrop.bind(this)
		this.onClose 					= this.onClose.bind(this)
		this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)

		this.submit 					= this.submit.bind(this)
		this.Auth 						= new AuthService();		
	}

	componentDidMount = () => {				

		this.Auth.fetch('/skills', { 
						method: 'GET' 
					}).then(res => {
						this.setState({ options: res })       
				})

		this.Auth.fetch(`/user/${this.props.match.params.id}`, {
							method: 'GET',
						}).then(res => {
							let response = res;
							if(res.skills)
								response.skills = res.skills.replace(/\s|\[|\]|"/g, '').split(',');
							let _this = this;
							setTimeout(function() {
								_this.setState({ data: response, loading: false });								
							}, 500);
						})
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}

	afterOpenModal() {
		// references are now sync'd and can be accessed.
		console.log(this.state.preview);
	}

	closeModal() {
		this.setState({modalIsOpen: false});		
	}

	saveAvatar() {
		let data = this.state.data;
		data.avatar = this.state.preview;
		this.setState({data: data});		
		this.setState({modalIsOpen: false});
	}

	onClose() {
		this.setState({preview: null})
	}

	onCrop(preview) {
		this.setState({preview: preview });
	}

	onBeforeFileLoad(elem) {
		if(elem.target.files[0].size > 716800){
			alert("File is too big!");
			elem.target.value = "";
		};
	}

	modules = {
		toolbar: [
			[{ 'header': [1, 2, 3, false] }],
			['bold', 'italic', 'underline','strike', 'blockquote'],
			[{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
			['link', 'image'],
			['clean']
		]
	}

	formats = [
		'header',
		'bold', 'italic', 'underline', 'strike', 'blockquote',
		'list', 'bullet', 'indent',
		'link', 'image'
	]

	submit(values) {
		let _this = this;

		this.setState({ loading: true });
		let params = values;
		params.avatar = this.state.data.avatar;

		this.Auth.fetch(`/user/${this.props.match.params.id}`, {
					method: 'PUT',
					body: JSON.stringify(params)
				}).then(res => {
				setTimeout(function() {
							_this.setState({ messageText: res.message, messageOpen: true, messageType: 'success', loading: false, data: values })
						}, 500);
			})
	}

	render() {
		return (
			<div>
				<Message
					type={this.state.messageType}
					message={this.state.messageText}
					open={this.state.messageOpen}
				/>
				{ this.state.loading 
					? <LinearProgress color="primary" />
					: <Form
							onSubmit={this.submit}
							initialValues={this.state.data}
							render={({ handleSubmit, submitting, pristine, values }) => (
												<form onSubmit={handleSubmit}>			    			
													<Grid container spacing={24} className="user-profile" >					    		
													<Grid md={1} item >
													</Grid>
													<Grid item md={3}>
														<img 
															src={this.state.data.avatar.constructor === Object 
																		? this.state.data.avatar.url 
																			? this.state.data.avatar.url 
																			: this.state.data.picture ? this.state.data.picture : require('../../assets/img/avatar.png')
																		: this.state.data.avatar ? this.state.data.avatar : require('../../assets/img/avatar.png') }
															alt="avatar" 
															className="img-circle avatar-img" 
															onClick={this.openModal} 
															width="150"
														/>
														<Modal
															isOpen={this.state.modalIsOpen}
															onAfterOpen={this.afterOpenModal}
															style={avatarModalStyle}
														>
															<img src={this.state.preview } alt="Preview" />
															<hr />
															<Avatar
																width={'100%'}
																height={295}
																onCrop={this.onCrop}
																onClose={this.onClose}
																onBeforeFileLoad={this.onBeforeFileLoad}
																src={this.state.data.avatar.constructor === Object 
																			? this.state.data.avatar.url 
																				? this.state.data.avatar.url 
																				: this.state.data.picture ? this.state.data.picture : require('../../assets/img/avatar.png')
																			: this.state.data.avatar ? this.state.data.avatar : require('../../assets/img/avatar.png') }
															/>
															<hr />
															<Button variant="contained" color="primary" onClick={this.saveAvatar} >Save</Button> &nbsp;&nbsp;
															<Button variant="contained" onClick={this.closeModal} >Cancel</Button>	        
														</Modal>		    				
														<br/><br/>
														<Field
															name="name"
															component={TextField}								            
															maxLength={20}
															tooLong="That name is too long!"
															pattern="[A-Z].+"
															placeholder="Name"
															patternMismatch="Name is not correct format. eg: John"
															required
															label="Name"
															fullWidth
														/>
														<br/><br/>
														<Field
															name="email"
															component={TextField}
															placeholder="Email"
															typeMismatch="That's not an email address"
															type="email"
															autoComplete="email"
															required
															label="Email"
															fullWidth
														/>
														<br/><br/>
														<Field
															name="phone"
															component={TextField}								            
															maxLength={15}
															tooLong="That name is too long!"
															pattern="[0-9].+"
															placeholder="Phone number"
															patternMismatch="Phone number should include only 0 - 9."
															required
															label="Phone"
															fullWidth
														/>
														<br/><br/>
														<Field
															name="address"
															component={TextField}								            
															placeholder="Address"
															required
															label="Address"
															fullWidth
														/>
													</Grid>
													<Grid item md={7}>
														<Hidden smDown>
															<div className="text-right">
															<Button variant="contained" color="primary" disabled={submitting || pristine} type="submit" >Save</Button> &nbsp;&nbsp;	
															<Button variant="contained" component={Link} to={`/user/${this.props.match.params.id}`} >Cancel</Button>
															</div>
														</Hidden>
														<br/><br/>
														<Field
															name="tagline"
															component={TextField}
															placeholder="Tagline"
															required
															label="Tagline"
															fullWidth
														/>
														<br/><br/><br/>
														<Field
															name="description"
															render={({ input, meta }) => (
																				<div>
																					<ReactQuill {...input}
																						theme="snow"
																						modules={this.modules}
																						formats={this.formats}>
																					</ReactQuill>
																				</div>
																			)}
														/>
														<br/><br/>
														<Field
															name="skills"
															render={({ input, meta }) => (
															<div {...input}>
															<TagsSelect {...input}
																label="Skills"
																helperText="You can add a new skill by writing its name and pressing enter"
																options={this.state.options}
																SelectProps={{
																	isCreatable: true,
																	msgNoOptionsAvailable: "All tags are selected",
																	msgNoOptionsMatchFilter: "No tag matches the filter"
																}}
															/>
															</div>
															)}
														/>
													</Grid>
													<Grid md={1} item >
													</Grid>
													</Grid>
												</form>					
											)}
					/>
				}
			</div>			
		)
	}
}

export default EditProfile;