import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AboutIcon from '@material-ui/icons/Receipt';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Login from '@material-ui/icons/Person';
import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import InputBase from '@material-ui/core/InputBase';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Message from '../share/Message';
import AuthService from '../services/AuthService';

const drawerWidth = 240;

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit * 5,
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 8,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 100,
			'&:focus': {
				width: 200,
			},
		},
	},
});

class Navbar extends React.Component {

	constructor(props) {
	  super(props);

	  this.Auth = new AuthService();
	
	  this.state = {
	    open: false,
	    anchorEl: null,
	    mobileMoreAnchorEl: null,
	    isAuthenticated: this.Auth.loggedIn(),
	    messageType: 'error',
	    messageOpen: false,
	    messageText: '',
      userId: 0,
      data: {}
	  };

	  this.handleLogOut = this.handleLogOut.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

	}

  componentDidMount = () => {
    let _this = this;
    if(this.state.isAuthenticated){
      this.setState({ userId: this.Auth.getProfile().user_id });      
      this.Auth.fetch(`/user/${this.Auth.getProfile().user_id}`, {
                method: 'GET',
              }).then(res => {
                _this.setState({ data: res });
              })
    }      
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleLogOut = () => {
  	this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
    this.Auth.logout();
    this.setState({ isAuthenticated: false });    
  }

  handleSearch = (e) => {
    if (e.key === 'Enter')
      this.props.history.push(`/search/${e.target.value}`);
  }

  render() {

  	const { classes, theme } = this.props;
    const { open, anchorEl, mobileMoreAnchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
        PaperProps={{
            style: {
              marginTop: '35px'
            },
          }}
      >
        <MenuItem component={Link} to={"/user/" + this.state.userId } onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem component={Link} to="/login" onClick={this.handleLogOut}>Log Out</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={this.state.data.posts ? this.state.data.posts.length : 0 } color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Posts</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={this.state.data.following ? this.state.data.following.length : 0 } color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <div>
      	<Message
          type={this.state.messageType}
          message={this.state.messageText}
          open={this.state.messageOpen}
        />
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              C-Social
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                onKeyPress={this.handleSearch}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <div className={classes.grow} />
            { this.state.isAuthenticated ? (
            	<div>
	            	<div className={classes.sectionDesktop}>                  
		              <IconButton color="inherit">
		                <Badge badgeContent={this.state.data.posts ? this.state.data.posts.length : 0 } color="secondary">
		                  <MailIcon />
		                </Badge>
		              </IconButton>
		              <IconButton color="inherit" href="/messages" >
		                <Badge badgeContent={this.state.data.following ? this.state.data.following.length : 0 } color="secondary">
		                  <NotificationsIcon />
		                </Badge>
		              </IconButton>
		              <IconButton
		                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
		                aria-haspopup="true"
		                onClick={this.handleProfileMenuOpen}
		                color="inherit"
		              >
		                {this.state.data.avatar
                      ? <img src={this.state.data.avatar.url 
                                  ? this.state.data.avatar.url 
                                  : this.state.data.picture ? this.state.data.picture : require('../../assets/img/avatar.png')} className="img-circle" width="35" alt="avatar" />
                      : <AccountCircle />
                    }
		              </IconButton>
		            </div>
		            <div className={classes.sectionMobile}>
		              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
		                <MoreIcon />
		              </IconButton>
		            </div>
		        </div>
            	) : (
            	<div>
            		<IconButton component={Link} to="/login" color="inherit" onClick={this.handleDrawerClose}>
            			<Login />
		            </IconButton>
				</div>
            	) }
            
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
          	<ListItem button component={Link} to="/" onClick={this.handleDrawerClose}>
          		<ListItemIcon>
					<HomeIcon />
				</ListItemIcon>
			  	<ListItemText primary="Home" />
			</ListItem>
            <ListItem button component={Link} to="/about" onClick={this.handleDrawerClose}>
            	<ListItemIcon>
					<AboutIcon />
				</ListItemIcon>
			  	<ListItemText primary="About" />
			</ListItem>
          </List>
        </Drawer>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Navbar);
