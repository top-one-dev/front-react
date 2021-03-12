import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import Navbar from './components/navbar/Navbar.jsx';
import App from './components/home/App.jsx';
import About from './components/about/About.jsx';
import LogIn from './components/user/LogIn.jsx';
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
import SignUp from './components/user/SignUp.jsx';
import ForgetPass from './components/user/ForgetPass.jsx';
import Profile from './components/user/Profile.jsx';
import EditProfile from './components/user/EditProfile.jsx';
import Post from './components/post/Post.jsx';
import Search from './components/home/Search.jsx';
import ConversationsList from './components/message/ConversationsList';
import * as serviceWorker from './serviceWorker';

const routing = (
	<Router>
		<div>
			<Route component={Navbar} />
			<Route exact path="/" component={App} />
			<Route path="/about" component={About} />
			<Route path="/login" component={LogIn} />
			<Route path="/signup" component={SignUp} />
			<Route path="/forgetpass" component={ForgetPass} />
			<Route path="/user/:id" component={Profile} />
			<Route path="/edit/user/:id" component={EditProfile} />
			<Route path="/post/:id" component={Post} />
			<Route path="/search/:query" component={Search} />
			<Route path="/messages" component={ConversationsList} />
			<Route exact path="/linkedin" component={LinkedInPopUp} />
		</div>
	</Router>
)

ReactDOM.render(routing, document.getElementById('root'));

serviceWorker.unregister();
