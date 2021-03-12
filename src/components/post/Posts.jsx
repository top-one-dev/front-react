import React, { Component }  from 'react';
import './posts.css';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import TimeAgo from 'react-timeago';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form-html5-validation';
import {TextField} from 'final-form-material-ui';
import ReactQuill from 'react-quill';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ReactHtmlParser from 'react-html-parser';
import Comments from './Comments.jsx';
import AuthService from '../services/AuthService';
import Message from '../share/Message';

const timeIconStyles = {
	fontSize: '15px',
	verticalAlign: 'bottom'
};
 
class Posts extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isOwner: 				this.props.isOwner,
			messageType: 		'error',
			messageOpen: 		false,
			messageText: 		'',
			posts: 					props.posts,			
		};

		this.handleDelete = this.handleDelete.bind(this);
		this.submit 			= this.submit.bind(this);
		this.Auth 				= new AuthService();		
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ isOwner: nextProps.isOwner});
	}

	handleDelete(i){
		const url = '/posts/' + this.state.posts[i].id;
		this.Auth.fetch( url, {
					method: 'DELETE'
				}).then(res => {
					let posts = this.state.posts;
					posts.splice(i, 1);
					this.setState({ messageText: res.message, messageOpen: true, messageType: 'success', posts: posts });
			})
	}

	submit(values) {
		this.Auth.fetch('/posts', {
					method: 'POST',
					body: JSON.stringify(values)
				}).then(res => {
					let posts = this.state.posts;
					posts[posts.length] = res;
					this.setState({ messageText: "Posted Successfully!", messageOpen: true, messageType: 'success', posts: posts })
			})
	}

	modules = {
	    toolbar: {
	    	container: [
				[{ 'header': [1, 2, 3, false] }],
				['bold', 'italic', 'underline','strike', 'blockquote'],
				[{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
				['link', 'image'],
				['clean']
		    ],
		    handlers: this.imgHandler
		}
	}

	formats = [
	    'header',
	    'bold', 'italic', 'underline', 'strike', 'blockquote',
	    'list', 'bullet', 'indent',
	    'link', 'image'
	]

	render() {
		return (
			<div>
				<Message
					type={this.state.messageType}
					message={this.state.messageText}
					open={this.state.messageOpen}
				/>
				<Typography variant="h5" gutterBottom> {this.state.posts.length} Posts </Typography>
				{this.state.posts.map((post, i) =>
							<Paper elevation={2} className="post-paper" key={i} >
								<Typography variant="h6" gutterBottom >
									<Link to={`/post/${post.id}`} >{post.title}</Link>
									{this.state.isOwner
										?	<IconButton aria-label="Delete" size="small" className="pull-right" onClick={() => this.handleDelete(i)} >
												<Icon>delete</Icon>
											</IconButton>
										: ''}									
								</Typography>
								<Typography variant="body2" className="quill-content"  gutterBottom>
									{ReactHtmlParser(post.content)}
								</Typography>								
								<Typography variant="caption" gutterBottom className="text-right">
									<Icon style={timeIconStyles} >access_time</Icon> <TimeAgo date={post.created_at} />
								</Typography>
								<Comments comments={post.comments} post={post.id} />		
							</Paper>
				)}
				{this.state.isOwner
					? <Paper className="post-paper">
							<Form
								onSubmit={this.submit}
								initialValues={this.state.data}
								render={({ handleSubmit, submitting, pristine, values }) => (
											<form onSubmit={handleSubmit} >
												<Field
													name="title"
													component={TextField}
													required
													label="Title"
													fullWidth
												/>
												<br /><br />
												<Field
													name="content"
													render={({ input, meta }) => (
																<div>
																	<ReactQuill {...input}
																		modules={this.modules}
																		formats={this.formats} >
																	</ReactQuill>
																</div>
														)}
												/>
												<br />
												<div className="text-right">
													<Button variant="contained" color="primary" disabled={submitting || pristine} type="submit" >
														{ submitting ? 'Posting...' : 'Post' }
													</Button>
												</div>
											</form>
										)}
							/>
						</Paper>
					: ''
				}				
			</div>
		)
	}
}

export default Posts;