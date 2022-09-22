import React, { useState, useEffect } from 'react';
import './Admin.css';
import { Button, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import API from '@aws-amplify/api';



function App() {
  const [clockTitle, setClockTitle] = useState([]);  
  const [clockLabels, setClockLabels] = useState([]);  

  useEffect(() => {
    getConfigure()
  });

  async function getConfigure(){
    await getClockConfig(); 
  }

  function getClockConfig () {
    API.get("apicogni", "/api/tests/clock/alltitles").then((res)=>{setClockTitle(res)})
    API.get("apicogni", "/api/test/clock/labels").then((res)=>{setClockLabels(res)})
  }

  
  function configTwoValues(value, title){
    return(
            <Stack direction="row">
              <TextField className='config_textField'
                hiddenLabel
                id="filled-hidden-label-normal"
                defaultValue={value}
                variant="filled"
              />
              <div className='config_title'>{title}</div>
            </Stack>      
    );
  }

  
  return (
    <Card className="card">
      <div width="100%">
        <p>Shulman Clock</p>
        <Paper className='paper_config' elevation={3} width="70%">
          <Stack
            component="form"
            spacing={2}
            noValidate
            autoComplete="off"
          >
            {configTwoValues(clockTitle, "כותרת:")}
            
            
            
            <TextField
              hiddenLabel
              id="filled-hidden-label-normal"
              defaultValue="Normal"
              variant="filled"
            />
            <TextField
              hiddenLabel
              id="filled-hidden-label-normal"
              defaultValue="Normal"
              variant="filled"
            />
            <Button 
              variant="contained"
                size="medium" 
                onClick={async () => {
                  
                }}
          >
                  עדכן 
          </Button>
          </Stack>


        
        
          
        </Paper>
        {/* tests configure */}
        {/* Clock img, title */}
        {/* SI - img, qs per lang */}

        
      </div>
    </Card>
  );
}

export default App;