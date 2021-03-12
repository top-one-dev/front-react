import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import TimeAgo from 'react-timeago';
import ReactHtmlParser from 'react-html-parser';
import LinearProgress from '@material-ui/core/LinearProgress';
import EllipsisText from "react-ellipsis-text";
import AuthService from '../services/AuthService';

class App extends Component {	

	constructor(props) {
	  super(props);
	  this.state = {
	  	loading: 	true,
	  	query: 		this.props.match.params.query,
	  	result: 	{}
	  };
	  this.Auth = new AuthService();
	}

	componentDidMount = () => {
		this.Auth.fetch('/search', {
						method: 'POST',
						body: JSON.stringify({ query: this.state.query })
					}).then(res => {
						this.setState({ result: res, loading: false });
					})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: true, query: nextProps.match.params.query });
		this.Auth.fetch('/search', {
						method: 'POST',
						body: JSON.stringify({ query: nextProps.match.params.query })
					}).then(res => {
						this.setState({ result: res, loading: false });
					})
	}

	highlight(string, sub){
		var reg = new RegExp(sub,"gi");
		return string.replace(reg, function (x) { return `<mark>${x}</mark>`; })
	}

	render() {
		const timeIconStyles = {
			fontSize: '15px',
			verticalAlign: 'bottom'
		}

		return (
			<div>
				{ this.state.loading
						? <LinearProgress color="primary" />
						: <Grid container spacing={24} className="user-profile" >
								<Grid md={1} item >
								</Grid>
								<Grid item md={10}>
									<Typography variant="h6" gutterBottom>
										{ this.state.result.users.length } Users searched by <i>"{this.state.query}"</i>
									</Typography>
									{this.state.result.users.map((user, i) =>
											<Paper className="post-paper search-user" key={i} >
												<Grid container direction="row">
													<span>
														<img src={user.avatar.url 
																			? user.avatar.url 
																			: user.picture ? user.picture : require('../../assets/img/avatar.png')} 
																	alt="alt" className="img-circle pull-left" width="110" height="110" /><br />
														<span className="follow">
															<Icon className="profile-icon" color="primary">favorite</Icon>{user.password_digest} follow
														</span>
													</span>
													<span className="pull-right">
														<Typography variant="subtitle1" gutterBottom>
															<Link to={`/user/${user.id}`} >{ReactHtmlParser(this.highlight(user.name, this.state.query))}</Link>
														</Typography>
														<Typography variant="body1" gutterBottom>
															{ReactHtmlParser(this.highlight(user.tagline, this.state.query))}
														</Typography>
														<Typography variant="caption" className="description" gutterBottom>
															{ReactHtmlParser(this.highlight(user.description, this.state.query))}
														</Typography>
														{user.skills
															? user.skills.replace(/\s|\[|\]|"/g, '').split(',').map((skill, i) =>
																<Chip label={skill} className={new RegExp(this.state.query,"gi").test(skill)
																																? 'skill-chip highlight'
																																: 'skill-chip' } key={i} />
															)
															: '...'}
													</span>
												</Grid>
											</Paper>
									)}
									<br /><br />
									<Typography variant="h6" gutterBottom>
										{ this.state.result.posts.length } Posts searched by <i>"{this.state.query}"</i>
									</Typography>
									{this.state.result.posts.map((post, i) =>
											<Paper elevation={2} className="post-paper" key={i} >
												<Typography variant="subtitle1" color="primary" gutterBottom >
													<Link to={`/post/${post.id}`} >{ReactHtmlParser(this.highlight(post.title, this.state.query))}</Link>
												</Typography>
												<div className="clearfix"></div>
												<Typography variant="caption" className="quill-content"  gutterBottom>
													{ReactHtmlParser(this.highlight(post.content, this.state.query))}
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
				}
			</div>
		);
	}
}

export default App;
