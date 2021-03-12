import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import AuthService from '../services/AuthService';


class NewConversationForm extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      userId: '',
      title: '',
      users: []
    };
    this.Auth = new AuthService();
  }

  componentDidMount(){
    this.Auth.fetch('/users', {
            method: 'GET',
          }).then(res => {
            this.setState({ users: res });
          })
  }
  

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault()
    this.Auth.fetch('/conversations', {
            method: 'POST',
            body: JSON.stringify(this.state)
          }).then(res => 
            this.setState({ title: '' })
          )
  };

  render = () => {
    return (
      <Paper className="newConversationForm" elevation={1}>
        <form onSubmit={this.handleSubmit}>                  
          <TextField
            label="New room title:"
            value={this.state.title}
            onChange={this.handleChange('title')}
            fullWidth
            required
          />
          <br /><br /><br />
          <TextField
            select
            value={this.state.userId}
            onChange={this.handleChange('userId')}
            helperText="Please select user for chatting..."
            fullWidth
            required
          >
            {this.state.users.map(user => (
              <MenuItem  key={user.id} value={user.id}>
                <img src={user.avatar.url 
                          ? user.avatar.url 
                          : user.picture ? user.picture : require('../../assets/img/avatar.png')} 
                     alt="alt" className="img-circle" width="32" />&nbsp;&nbsp;
                {user.name}
              </MenuItem >
            ))}
          </TextField>
          <br /><br /><br />
          <Button variant="contained" color="primary" type="submit">
            Create
          </Button>
        </form>
      </Paper>
    );
  };
}

export default NewConversationForm;