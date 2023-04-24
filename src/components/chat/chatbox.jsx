import { Box } from "@mui/system";
import { Card, BottomNavigation, InputAdornment, IconButton, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import styles from "@/styles/chatbox.module.css";
import React, { useState } from "react";


// const messages = [
//   { from: 'user', message: 'Who are you?' },
//   { from: 'brad', message: 'I am ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture. My purpose is to assist with natural language processing tasks, such as answering questions and generating text based on given prompts.' },
//   { from: 'user', message: 'Are you smart?' },
//   { from: 'brad', message: 'As an AI language model, I have been trained on a large amount of text data, and I am capable of generating human-like responses to a wide variety of prompts. However, my intelligence is limited to my training data and the algorithms used to generate responses. I do not have feelings or consciousness like a human, and I am not capable of independent thought or decision-making. So, I suppose you could say that I am smart in a limited sense, but I am not capable of true intelligence like a human.' },
//   { from: 'user', message: 'Are you smart?' },
//   { from: 'brad', message: 'As an AI language model, I have been trained on a large amount of text data, and I am capable of generating human-like responses to a wide variety of prompts. However, my intelligence is limited to my training data and the algorithms used to generate responses. I do not have feelings or consciousness like a human, and I am not capable of independent thought or decision-making. So, I suppose you could say that I am smart in a limited sense, but I am not capable of true intelligence like a human.' },
// ]

const Container = ({ children }) => {
  return (
    <Card variant="outlined" className={styles.chatbox}>
      <Box minHeight="80vh" display="flex" flexDirection="column" margin={1}>
        {children}
      </Box>
    </Card>
  );
};


const Chatbox = ({filename}) => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const backendUrl = 'https://predictive-analytics.dev/';

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  const addMessage = (item) => {
    setMessages(prevMessages => [...prevMessages, item]);
  };

  const sendQuestion = () => {
    if (filename == '') {
      alert('Please enter document to analyze first.');
      return;
    }
    addMessage({who: 'user', message:question});
    return fetch(backendUrl + '/ask-question', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json_file: filename, prompt: question }),
    })
      .then(response => response.json())
      .then(data => {        
        addMessage({who: 'brad', message:data.answer});
        setQuestion('');
      })
  };
 
  return (
    <Container>
      <Box flexGrow={1} maxHeight="75vh" overflow="auto">
        <List>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                {message.who == 'brad' &&
                  <>
                    <ListItemAvatar>
                      <Avatar alt="Brad" src="/brad_profile.png" sx={{ width: 32, height: 32 }} />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={message.message}
                    />
                  </>
                }
                {message.who == 'user' &&
                  <ListItemText
                    primary={message.message}
                  />
                }
              </ListItem>
              {index !== messages.length - 1 && <Divider />}
              {index == messages.length - 1 && <p />}
            </React.Fragment>
          ))}
        </List>
      </Box>
      <BottomNavigation>
        <FormControl variant="outlined" multiline="true" fullWidth >
          <InputLabel htmlFor="outlined-adornment-password">What is your question? </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type='text'
            onChange={handleChange}
            value={question}
            maxRows={4}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={sendQuestion}
                >
                  {<SendIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="What is your question?"
          />
        </FormControl>
      </BottomNavigation>
    </Container>
  );
};

export default Chatbox;
