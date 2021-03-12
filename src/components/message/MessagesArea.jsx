import React from 'react';
import NewMessageForm from './NewMessageForm';
import AuthService from '../services/AuthService';
import {emojify} from 'react-emojione';
import TimeAgo from 'react-timeago';
import { ActionCableConsumer } from 'react-actioncable-provider';

const Auth = new AuthService();

class MessagesArea extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      cmessages: props.conversation.cmessages,
      status: props.conversation.users.map(function(user) {
                return { user_id: user.id, online: true } ;
              })
    };

    this.handleReceivedAppearances = this.handleReceivedAppearances.bind(this);
  }

  scrollToBottom = () => {
    this.el.scrollTop = this.el.scrollHeight;
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  } 

  handleReceivedAppearances(res) {
    console.log(res);
    let status = this.state.status;
    let user_status = this.state.status.find(
        status => status.user_id === res.user_id
    );
    status.splice(status.indexOf(user_status), 1);
    status.push(res);
    this.setState({status: status });
  } 

  render = () => {

    const options = {
      convertShortnames: true,
      convertUnicode: true,
      convertAscii: true,
      style: {
          height: 32,
          margin: 4,
      },
    };

    const orderedMessages = messages => {
      const sortedMessages = messages.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      return sortedMessages.map(message => {
        return <div key={message.id} className={ message.user.id === Auth.getProfile().user_id ? 'owner text-right' : 'partner' } >
                { message.user.id === Auth.getProfile().user_id 
                  ? '' 
                  : <img src={ message.user.avatar 
                              ? message.user.avatar
                              : message.user.picture ? message.user.picture : require('../../assets/img/avatar.png')} 
                         alt="alt" className={ this.state.status.find( status => status.user_id === message.user.id ).online 
                                               ? 'img-circle online'
                                               : 'img-circle offline' } />
                } 
                <span>
                  <small>
                    {message.user.id === Auth.getProfile().user_id
                      ? ''
                      : `${message.user.name},` } <TimeAgo date={message.created_at} />
                  </small>
                  {emojify(message.content, options)}<br/>
                  {message.attach.url
                    ? <img src={message.attach.url} className="img-responsive" alt="message_img" />
                    : ''
                  }
                </span>                
               </div>;
      });
    }

    return (
      <div>
        <ActionCableConsumer
          channel={{ channel: 'AppearancesChannel' }}
          onReceived={this.handleReceivedAppearances}
        />
        <h3 className="title">
          {this.props.conversation.title}
        </h3>
        <div className="messagelist" ref={(el) => { this.el = el; }}>
        { this.props.conversation.cmessages
          ? orderedMessages(this.props.conversation.cmessages) 
          : '' }
        </div>
        <NewMessageForm conversation_id={this.props.conversation.id} />
      </div>
    );

  }

}

export default MessagesArea;
