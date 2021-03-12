import React, { Component } from 'react';
import './about.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class About extends Component {
	render() {
		return (
			<div>
				<div className="parallax about-banner">
					<Typography variant="h4" gutterBottom>
						About Us
					</Typography>
				</div>
				<Grid container spacing={24} className="about-container">
			        <Grid item xs>
			          <Typography variant="body1" gutterBottom>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Urna et pharetra pharetra massa massa ultricies. Sapien nec sagittis aliquam malesuada bibendum arcu. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Aenean vel elit scelerisque mauris. Elit pellentesque habitant morbi tristique senectus et netus. Ante in nibh mauris cursus mattis molestie a iaculis. Magna sit amet purus gravida quis. Tincidunt augue interdum velit euismod in.<br/>
						Purus in massa tempor nec feugiat nisl pretium. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Sem nulla pharetra diam sit amet. Elementum eu facilisis sed odio morbi quis commodo. Elit ullamcorper dignissim cras tincidunt. At risus viverra adipiscing at in tellus integer. Ante metus dictum at tempor commodo ullamcorper. Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui. Tempor nec feugiat nisl pretium fusce id velit ut. Orci ac auctor augue mauris augue neque gravida in. Habitant morbi tristique senectus et netus et malesuada. Lacus sed viverra tellus in hac habitasse platea. Mi quis hendrerit dolor magna eget.<br/>
						Purus in massa tempor nec feugiat nisl pretium. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Sem nulla pharetra diam sit amet. Elementum eu facilisis sed odio morbi quis commodo. Elit ullamcorper dignissim cras tincidunt. At risus viverra adipiscing at in tellus integer. Ante metus dictum at tempor commodo ullamcorper. Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui. Tempor nec feugiat nisl pretium fusce id velit ut. Orci ac auctor augue mauris augue neque gravida in. Habitant morbi tristique senectus et netus et malesuada. Lacus sed viverra tellus in hac habitasse platea. Mi quis hendrerit dolor magna eget.
					  </Typography>
			        </Grid>
			    </Grid>	
			</div>
		);
	}
}

export default About;
