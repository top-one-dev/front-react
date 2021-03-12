import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import HomeSlider from './HomeSlider';
import Gallery from "react-photo-gallery";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import TimeAgo from 'react-timeago';
import ReactHtmlParser from 'react-html-parser';
import LinearProgress from '@material-ui/core/LinearProgress';
import EllipsisText from "react-ellipsis-text";
import Tooltip from '@material-ui/core/Tooltip';
import AuthService from '../services/AuthService';


class App extends Component {	

	constructor(props) {
	  super(props);
	  this.Auth = new AuthService();	
	  this.state = {
	  	isAuthenticated: this.Auth.loggedIn(),
	  	loading: true,
	  	posts: {},
	  	photos: [],
	  };
	}

	componentDidMount(){
		let _this = this;
    if(this.state.isAuthenticated)
      this.Auth.fetch('/posts', {
                method: 'GET',
              }).then(res => {
                _this.setState({ posts: res, loading: false });
              })
    else
    	this.Auth.fetch('/gallery', {
                method: 'GET',
              }).then(res => {
                _this.setState({ photos: res, loading: false });
              })
	}

	render() {		

		const timeIconStyles = {
			fontSize: '15px',
			verticalAlign: 'bottom'
		}

		return (
			<div>
				{/*<HomeSlider />*/}
				{ this.state.isAuthenticated
					? this.state.loading
						? <LinearProgress color="primary" />
						: <Grid container spacing={24} className="user-profile" >
								<Grid md={1} item >
								</Grid>
								<Grid item md={10}>
									{ this.state.posts.map((post, i) =>
												<Paper elevation={2} className="post-paper" key={i} >
													<Typography variant="h5" color="primary" gutterBottom >
														<Link to={`/post/${post.id}`} >{post.title}</Link>													
															<Link to={`/user/${post.user.id}`} >
																<span className="post-writer pull-right" >
																	<img 	src={post.user.avatar.url 
																							? post.user.avatar.url 
																							: post.user.picture ? post.user.picture :require('../../assets/img/avatar.png')} 
																				className="img-circle post-avatar" alt="avatar" />
																	<Tooltip title={ post.user.description ? ReactHtmlParser(post.user.description) : '........' } placement="bottom">																	
																	<span className="pull-right">
																		{post.user.name}<br />
																		<small><EllipsisText text={post.user.tagline} length={"25"} /></small>
																	</span>
																	</Tooltip>
																</span>
															</Link>														
													</Typography>
													<div className="clearfix"></div>
													<Typography variant="body2" className="quill-content"  gutterBottom>
														{ReactHtmlParser(post.content)}
													</Typography>								
													<Typography variant="caption" gutterBottom className="text-right">
														<Icon style={timeIconStyles} >access_time</Icon> <TimeAgo date={post.created_at} />
													</Typography>
												</Paper>
									)}
								</Grid>
								<Grid md={1} item >
								</Grid>
							</Grid>							
					: this.state.loading
						? <LinearProgress color="primary" />
						: <Gallery photos={this.state.photos} direction={"column"} />
				}				
			</div>
		);
	}
}

export default App;
