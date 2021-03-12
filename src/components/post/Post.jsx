import React, { Component }  from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import TimeAgo from 'react-timeago';
import IconButton from '@material-ui/core/IconButton';
import ReactHtmlParser from 'react-html-parser';
import LinearProgress from '@material-ui/core/LinearProgress';
import Comments from './Comments.jsx';
import AuthService from '../services/AuthService';

const timeIconStyles = {
	fontSize: '15px',
	verticalAlign: 'bottom'
};
 
class Post extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isOwner: 					false,
			loading: 					true,
			post: 						{},	
		};

		this.Auth = new AuthService();
		this.handleDelete = this.handleDelete.bind(this);
	}

	componentDidMount = () => {
		this.Auth.fetch(`/posts/${this.props.match.params.id}`, {
						method: 'GET',
					}).then(res => {
						this.setState({ post: res, loading: false });
						if( this.Auth.loggedIn() )
							this.setState({ isOwner: ( res.user.id === this.Auth.getProfile().user_id )});
						else
							this.setState({ isOwner: false});
					})
	}

	componentWillReceiveProps(nextProps) {
		this.Auth.fetch(`/posts/${nextProps.match.params.id}`, {
						method: 'GET',
					}).then(res => {
						this.setState({ post: res, loading: false });
						if( this.Auth.loggedIn() )
							this.setState({ isOwner: ( res.user.id === this.Auth.getProfile().user_id )});
						else
							this.setState({ isOwner: false});
					})
	}

	handleDelete(){
		const url = '/posts/' + this.state.post.id;
		this.Auth.fetch( url, {
					method: 'DELETE'
				}).then(res => {
					this.setState({ messageText: res.message, messageOpen: true, messageType: 'success', post: res });
			})
	}

	setChange(user, current_user){
		if( user === current_user)
			this.setState({ isOwner: true });
		else
			this.setState({ isOwner: false });
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
			{ this.state.loading
				? <LinearProgress color="primary" />
				: <Grid container spacing={24} className="user-profile" >
						<Grid md={1} item >
						</Grid>
						<Grid item md={10}>
							<Typography variant="h4" color="primary" gutterBottom >
								{this.state.post.title}
								{this.state.isOwner
									?	<IconButton aria-label="Delete" size="small" className="pull-right" onClick={this.handleDelete} >
											<Icon>delete</Icon>
										</IconButton>
									: ''}									
							</Typography>
							<br />
							<Typography variant="body2" gutterBottom>
								{ReactHtmlParser(this.state.post.content)}
							</Typography>								
							<Typography variant="caption" gutterBottom className="text-right">
								<Icon style={timeIconStyles} >access_time</Icon> <TimeAgo date={this.state.post.created_at} />
							</Typography>
							<Comments comments={this.state.post.comments} post={this.state.post.id} />
						</Grid>
						<Grid md={1} item >
						</Grid>
					</Grid>
				}				
			</div>
		)
	}
}

export default Post;