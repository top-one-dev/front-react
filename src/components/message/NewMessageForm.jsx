import React from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import InsertEmoticon from '@material-ui/icons/InsertEmoticon';
import AuthService from '../services/AuthService';
import API from '../services/Api';
import EmojiPicker from 'emoji-picker-react';
import EmojiConvertor from 'emoji-js';

class NewMessageForm extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      content: '',
      attach: null,
      conversation_id: this.props.conversation_id,
      showEmoji: false,
      realContent: '',
    };
    this.Auth         = new AuthService();
    this.jsemoji      = new EmojiConvertor();
    this.AddEmoji     = this.AddEmoji.bind(this);
    this.handleFocus  = this.handleFocus.bind(this);
  }
  

  componentWillReceiveProps = nextProps => {
    this.setState({ conversation_id: nextProps.conversation_id });
  };

  handleChange = name => event => {
    if(name === 'attach')
      this.setState({ [name]: event.target.files[0] });
    else
      this.setState({ [name]: event.target.value });
  };

  handleFocus(){
    this.setState({ showEmoji: false });
  }

  AddEmoji(){
    this.setState({ showEmoji: true });
  }

  EmojiCallback =  (code, emoji) => {
    let emojiPic = this.jsemoji.replace_colons(`:${emoji.name}:`);
    this.setState({ content: `${this.state.content} ${emojiPic}`, showEmoji: false });
  }

  handleSubmit = e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('attach',this.state.attach);
    formData.append('content',this.state.content);
    formData.append('conversation_id',this.state.conversation_id);
    const config = {
        headers: {
            'Authorization': this.Auth.getToken(),
            'content-type': 'multipart/form-data'
        }
    }

    API.post('/messages', formData, config )
      .then(res => {
        this.setState({ content: '', attach: null })
      })
      .catch(function (error) {
        console.log(error)        
      });
  };

  render = () => {
    return (
      <div className="newMessageForm">
        <form onSubmit={this.handleSubmit}>
          <TextField
            label="Type text...."
            value={this.state.content}
            onChange={this.handleChange('content')}
            onFocus={this.handleFocus}
            variant="filled"
            className="message-content"
            fullWidth
          />
          {this.state.showEmoji
            ? <EmojiPicker onEmojiClick={this.EmojiCallback} />
            : ''
          }
          <IconButton color="primary" onClick={this.AddEmoji} className="messageEmoji">
              <InsertEmoticon />
          </IconButton>         
          <input accept="image/*" id="icon-button-file" onChange={this.handleChange('attach')}  type="file" />
          <label htmlFor="icon-button-file">            
            <IconButton color="primary" component="span" className="messageAttach">
              <PhotoCamera />
            </IconButton>
            <span className="preview-attach">
            { this.state.attach 
              ? this.state.attach.name.match(/.(jpg|jpeg|png|gif)$/i)
                ? <img src={URL.createObjectURL(this.state.attach)} alt="preview" /> 
                : this.state.attach.name
              :  ''}
            </span>
          </label>
        </form>
      </div>
    );
  };
}

export default NewMessageForm;