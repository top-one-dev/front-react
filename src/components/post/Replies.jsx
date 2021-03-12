import React, { Component }  from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TimeAgo from 'react-timeago';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form-html5-validation';
import {TextField} from 'final-form-material-ui';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import API from '../services/Api';
import AuthService from '../services/AuthService';
import Message from '../share/Message';


const moreIconStyles = {
  fontSize: '18px',
  verticalAlign: 'middle',
  marginLeft: '5px',
};

const timeIconStyles = {
  fontSize: '15px',
  verticalAlign: 'bottom'
};

 
class Replies extends Component {

	constructor(props) {
	  super(props);
	  this.state = {
			file: 					null,
			open: 					false,
			loading: 				false,
			messageType: 		'error',
			messageOpen: 		false,
			messageText: 		'',
			replies: 				this.props.replies,
			userId: 				0
	  };
	  this.Auth 				= new AuthService();		  
	  this.handleDelete = this.handleDelete.bind(this);
	  this.submit 			= this.submit.bind(this);
	  this.onChange 		= this.onChange.bind(this);	  

	}

	componentDidMount(){
		if( this.Auth.loggedIn() )
			this.setState({ userId: this.Auth.getProfile().user_id });
	}

	handleClick = () => {
	    this.setState(state => ({ open: !state.open }));
	}

	onChange(e) {
    this.setState({file:e.target.files[0]})
  }

  handleDelete(i){
		const url = '/posts/' + this.props.post + '/comments/' + this.props.comment + '/replies/' +  this.state.replies[i].id;
		this.Auth.fetch( url, {
					method: 'DELETE'
				}).then(res => {
					let replies = this.state.replies;
					replies.splice(i, 1);
					this.setState({ messageText: res.message, messageOpen: true, messageType: 'success', replies: replies });
			})
	}

	submit(values) {
		let 	_this = this;
		const url = '/posts/' + this.props.post + '/comments/' + this.props.comment + '/replies';
		const formData = new FormData();
    formData.append('attach',this.state.file);
    formData.append('content',values.content);
		const config = {
        headers: {
        		'Authorization': this.Auth.getToken(),
            'content-type': 'multipart/form-data'
        }
    }

		API.post(url, formData, config )
			.then(res => {
				let replies = _this.state.replies;
				replies[replies.length] = res.data;
				_this.setState({ messageText: 'Replied Successfully', messageOpen: true, messageType: 'success', replies: replies, file: null });
			})
			.catch(function (error) {
				console.log(error)				
			});
	}

	render() {
		return (
			<List>
				<Message
					type={this.state.messageType}
					message={this.state.messageText}
					open={this.state.messageOpen}
				/>
				<br />
				<ListItem button onClick={this.handleClick}>
				<Typography variant="body1" gutterBottom color="primary">
					Show {this.props.replies.length} Replies
					{this.state.open 
						? <Icon style={moreIconStyles} >expand_less</Icon> 
						: <Icon style={moreIconStyles} >expand_more</Icon>
					}
				</Typography>
				</ListItem>
				<Collapse in={this.state.open} timeout="auto" unmountOnExit>
					{ this.state.replies.map((reply, i) =>	  		
		          <List component="div" key={i} disablePadding>
		            <ListItem inset>
		              <ListItemText inset >
		              	{this.state.userId == reply.user.id
		              		? <IconButton aria-label="Delete" size="small" className="pull-right" onClick={() => this.handleDelete(i)} >
													<Icon>delete_outlined</Icon>
												</IconButton>
											: ''}
		              	<Typography variant="subtitle1" gutterBottom>
		              		<Link to={`/user/${reply.user.id}`} >
		              			<img src={reply.user.avatar.url 
		              								? reply.user.avatar.url 
		              								: reply.user.picture ? reply.user.picture :require('../../assets/img/avatar.png')} 
		              								className="img-circle comment-avatar" alt="avatar" /> {reply.user.name}
		              		</Link>             		
		              	</Typography>
		              	<div className="comment-div">
		              	<p>
		              	{reply.content}
		              	</p>
										{reply.attach.url
											?	reply.attach.url.match(/.(jpg|jpeg|png|gif)$/i)
												? <img src={reply.attach.url} className="img-responsive" alt="reply_img" /> 
												: <a href={reply.attach.url} ><Icon className="profile-icon" >attach_file</Icon> {reply.attach.url.split("/").pop()}</a>
											: ''
										}
		              	</div>
		              	<Typography variant="body2" gutterBottom>						  				
						  				<Typography variant="caption" gutterBottom className="text-right">
						  					<Icon style={timeIconStyles} >access_time</Icon> <TimeAgo date={reply.created_at} />
						  				</Typography>
					  		  	</Typography>
		              </ListItemText>	             
		            </ListItem>
		          </List>
		  			)}
					{ this.state.userId
						? <List component="div" disablePadding>
								<ListItem inset>
									<ListItemText inset >
										<Form
											onSubmit={this.submit}
											initialValues={this.state.data}
											render={({ handleSubmit, submitting, pristine, values }) => (
																		<form onSubmit={handleSubmit}>
																			<Field
																				name="content"
																				component={TextField}
																				required
																				label="Reply"
																				fullWidth
																			/>								        
																			<br />
																			<div className="text-right">
																				<input
																					id="outlined-button-file"
																					type="file"
																					multiple
																					onChange={this.onChange}																		
																				/>
																				<label htmlFor="outlined-button-file">
																					<span className="preview-span">
																					{ this.state.file 
																						? this.state.file.name.match(/.(jpg|jpeg|png|gif)$/i)
																							? <img src={URL.createObjectURL(this.state.file)} alt="preview" /> 
																							: this.state.file.name
																						:  ''}
																					</span>
																					<IconButton aria-label="Attach" color="primary" component="span" >
																						<Icon>cloud_upload</Icon>
																					</IconButton>													
																				</label>
																			</div>
																			<div className="text-right">
																				<Button variant="contained" color="primary" disabled={submitting || pristine} type="submit" >Reply</Button>
																			</div>
																		</form>
																		)}
										/>
									</ListItemText>
								</ListItem>
							</List>
						: ''
					}
				</Collapse>
			</List>
		)
	}
}

export default Replies;