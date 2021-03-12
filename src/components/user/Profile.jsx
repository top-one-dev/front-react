import React, { Component }  from 'react';
import './user.css';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import AddressIcon from '@material-ui/icons/LocationOn';
import EditIcon from '@material-ui/icons/Edit';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Posts from '../post/Posts';
import UserCard from '../post/UserCard';
import AuthService from '../services/AuthService';
 
class Profile extends Component {

	constructor(props) {
		super(props);	  

		this.Auth = new AuthService();

		this.state = {
			isOwner: false,
			loading: true,
			userId: this.props.match.params.id,
			data: {	},
			isFollowing: false,
			showFollowing: false,
			showFollowers: false,
		};

		this.follow 				= this.follow.bind(this);
		this.setChange 			= this.setChange.bind(this);
		this.showFollowing 	= this.showFollowing.bind(this);
		this.showFollowers 	= this.showFollowers.bind(this);
	}

	componentWillMount(){
		// if(!this.Auth.loggedIn())
		// 	this.props.history.push('/login');
	}

	componentDidMount = () => {
		this.Auth.fetch(`/user/${this.state.userId}`, {
						method: 'GET',
					}).then(res => {
						this.setState({ data: res, loading: false });
						if( this.Auth.loggedIn() )
							this.setChange(res, this.Auth.getProfile().user_id);
						else
							this.setChange(res, 0);
					})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: true });
		this.Auth.fetch(nextProps.match.url, {
						method: 'GET',
					}).then(res => {
						this.setState({ data: res, loading: false });
						if( this.Auth.loggedIn() )
							this.setChange(res, this.Auth.getProfile().user_id);
						else
							this.setChange(res, 0)
					})
	}

	follow(){
		let method = this.state.isFollowing ?  'DELETE' : 'POST';
		let url 	 = this.state.isFollowing ?  `/relationships/${this.state.data.id}` : '/relationships';
		this.Auth.fetch(url, {
						method: method,
						body: JSON.stringify({ id: this.state.data.id })
					}).then(res => {
						this.setState({ data: res });
						if( this.Auth.loggedIn() )
							this.setChange(res, this.Auth.getProfile().user_id);
						else
							this.setChange(res, 0)
					})
	}

	setChange(user, current_user){
		if( user.id == current_user)
			this.setState({ isOwner: true });
		else
			this.setState({ isOwner: false });
		if( user.followers.some(follower => current_user === follower.id) )
			this.setState({ isFollowing: true });
		else
			this.setState({ isFollowing: false });
	}

	showFollowing(){
		this.setState({ showFollowing: true, showFollowers: false });
	}

	showFollowers(){
		this.setState({ showFollowing: false, showFollowers: true });
	}

	render() {
		return (
			<div>
				{ this.state.loading
						? <LinearProgress color="primary" />
						:	<Grid container spacing={24} className="user-profile" >
								<Grid md={1} item >
								</Grid>
								<Grid item md={3}>
									{this.state.isOwner
										? ''
										: this.Auth.loggedIn()
											? <IconButton color="primary" onClick={this.follow} >
													<Icon>
														{this.state.isFollowing
															? 'favorite'
															: 'favorite_border'
														}
													</Icon>
												</IconButton>
											: ''
									}									
									<img src={this.state.data.avatar.url 
															? this.state.data.avatar.url 
															: this.state.data.picture ? this.state.data.picture : require('../../assets/img/avatar.png')} alt="alt" className="img-circle" width="150" />
									<br /><br />
									<Typography variant="h6" gutterBottom>
										{this.state.data.name}
										{ this.state.isOwner
											? <Hidden mdUp>
													<Link to={`/edit/user/${this.state.userId}`} className="pull-right" > 
														<IconButton color="primary" onClick={this.follow} >
															<EditIcon />
														</IconButton>
													</Link>
												</Hidden>
											: <span></span>
										}						
									</Typography>
									<Typography variant="subtitle2" gutterBottom>
										<MailIcon className="profile-icon" /> {this.state.data.email}
									</Typography>
									<Typography variant="subtitle2" gutterBottom>
										<PhoneIcon className="profile-icon" /> { this.state.data.phone ? this.state.data.phone : '...' }
									</Typography>
									<Typography variant="subtitle2" gutterBottom>
										<AddressIcon className="profile-icon" /> { this.state.data.address ? this.state.data.address : '...' }
									</Typography>
									<Typography variant="subtitle2" gutterBottom>
										<Button size="small" color="primary" onClick={this.showFollowing} >
											<Icon className="profile-icon" >near_me</Icon>{ this.state.data.following.length } followings
										</Button>
										<Button size="small" color="primary" onClick={this.showFollowers} >
											<Icon className="profile-icon" >wifi</Icon>{ this.state.data.followers.length } followers
										</Button>
									</Typography>
									<br />
									{this.state.showFollowing
										? this.state.data.following.map((user, i) =>
												<UserCard user={user} key={i} />
											)
										: ''
									}
									{this.state.showFollowers
										? this.state.data.followers.map((user, i) =>
												<UserCard user={user} key={i} />
											)
										: ''
									}
								</Grid>
								<Grid item md={7}>
									<Typography variant="h5" gutterBottom>
										{ this.state.data.tagline ? this.state.data.tagline : '...' }
										{ this.state.isOwner
											? <Hidden smDown>
													<Link to={`/edit/user/${this.state.userId}`} className="pull-right" > 
														<IconButton color="primary" onClick={this.follow} >
															<EditIcon />
														</IconButton>
													</Link>
												</Hidden>
											: <span></span>
										}
									</Typography>
									<Divider />
									<Typography variant="body1" className="quill-content" gutterBottom> 
										{ this.state.data.description ? ReactHtmlParser(this.state.data.description) : '.......' }
									</Typography>
									<br />					
									<Typography variant="subtitle1" gutterBottom> Skills </Typography>
									{this.state.data.skills
										? this.state.data.skills.replace(/\s|\[|\]|"/g, '').split(',').map((skill, i) =>
											<Chip label={skill} className="skill-chip" key={i} />
										)
										: '...'}
									<br /><br /><br />
									<Posts posts={this.state.data.posts} isOwner={this.state.isOwner} />
								</Grid>
								<Grid md={1} item >
								</Grid>
							</Grid>
				}
			</div>
		)
	}
}

export default Profile;