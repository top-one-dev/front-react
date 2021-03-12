import React from 'react';
import './message.css';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { ActionCableProvider, ActionCableConsumer } from 'react-actioncable-provider';
import NewConversationForm from './NewConversationForm';
import MessagesArea from './MessagesArea';
import AuthService from '../services/AuthService';

class ConversationsList extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      conversations: [],
      activeConversation: null
    };

    this.Auth = new AuthService();
    this.handleClick = this.handleClick.bind(this);
    this.handleReceivedConversation = this.handleReceivedConversation.bind(this);
  }

  componentDidMount = () => {
    this.Auth.fetch('/conversations', {
            method: 'GET',
          }).then(res => 
            this.setState({ conversations: res })
          )
   };

  handleClick = id => {
    this.setState({ activeConversation: id });
  };

  handleReceivedConversation = response => {
    const conversations = [...this.state.conversations];
    if (response.hasOwnProperty('conversation')){
      const { conversation } = response;
      const isExists = conversations.find(
        conv => conv.id === conversation.id
      );

      if( !isExists ){
        this.setState({
          conversations: [...this.state.conversations, conversation]
        });
      }else{
        console.log('double broadcast!');
      }
        
    }else{
      const { cmessage } = response;
      const conversation = conversations.find(
        conv => conv.id === cmessage.conversation_id
      );
      const isExists = conversation.cmessages.find(
        msg => msg.id === cmessage.id
      );
      if( !isExists ){
        conversation.cmessages = [...conversation.cmessages, cmessage];
        this.setState({ conversations });    
      }else{
        console.log('double broadcast!');
      }
      
    }     
    
  };

  render = () => {
    const { conversations, activeConversation } = this.state;
    const API_WS_ROOT = `ws://localhost:3000/cable?token=${this.Auth.getToken()}`;
    return (
      <ActionCableProvider url={API_WS_ROOT}>
      <Grid container spacing={24} >
        <Grid item md={3} className="converstaions">
          <ActionCableConsumer
            channel={{ channel: 'ConversationsChannel' }}
            onReceived={this.handleReceivedConversation}
          />
          <Divider />
          <List component="nav" subheader={<ListSubheader>&nbsp;</ListSubheader>} >
            <Divider />
            {mapConversations(conversations, this.handleClick)}
          </List>
          <Divider />
          <NewConversationForm />      
        </Grid>
        <Grid item md={9} className="messagearea">
          {activeConversation ? (
            <MessagesArea
              conversation={findActiveConversation(
                conversations,
                activeConversation
              )}
            />
          ) : ''}
        </Grid>     
      </Grid>
      </ActionCableProvider>
    );
  };
}

export default ConversationsList;

// helpers

const findActiveConversation = (conversations, activeConversation) => {
  return conversations.find(
    conversation => conversation.id === activeConversation
  );
};

const mapConversations = (conversations, handleClick) => {
  return conversations.map(conversation => {
    return (
      <ListItem key={conversation.id} onClick={() => handleClick(conversation.id)} button>
        <ListItemText color="primary" primary={conversation.title} />
        {conversation.users.map( user => (
          <img src={user.avatar 
                    ? user.avatar
                    : user.picture ? user.picture : require('../../assets/img/avatar.png')} 
               alt="alt" className="img-circle" width="25" key={user.id} /> 
         ))}
      </ListItem>
    );
  });
};