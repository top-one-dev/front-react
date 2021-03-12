import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import EllipsisText from "react-ellipsis-text";

const styles = theme => ({
  card: {
    display: 'flex',
    minHeight: 85,
    maxWidth: 320,
    marginBottom: 20,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 85,
    backgroundColor: '#eee',
  }
});

function UserCard(props) {
  const { classes } = props;

  return (
  		<Link to={`/user/${props.user.id}`} >
				<Card className={classes.card}>
					<CardMedia
						className={classes.cover}
						image={props.user.avatar.url 
									? props.user.avatar.url 
									: props.user.picture ? props.user.picture : require('../../assets/img/avatar.png')}
						title={props.user.name}
					/>
					<div className={classes.details}>					
						<CardContent className={classes.content}>
						<Typography variant="button">
						  {props.user.name}
						</Typography>
						<Typography variant="caption" color="textSecondary">
						  <EllipsisText text={props.user.tagline} length={"30"} />
						</Typography>
						</CardContent>					
					</div>      
				</Card>
			</Link>
  );
}

UserCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(UserCard);