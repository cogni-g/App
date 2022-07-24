import React, { useState, useEffect } from 'react';
import './Admin.css';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import API from '@aws-amplify/api';



function App() {
  // const [page, setPage] = useState(0);  
  // const [admin, setAdmin] = useState(false);  

 
  async function getConfigure(){
    // TODO
    await API.get("apicogni", `/api/tests/clock/`)   
  }

  useEffect(() => {
    // getConfigure()
  });
  
  return (
    <Card className="card">
      <div width="100%">

        {/* tests configure */}
        {/* Clock img, title */}
        {/* SI - img, qs per lang */}

        <Button 
            variant="contained"
              size="medium" 
              onClick={async () => {
                
              }}
        >
                עדכן 
        </Button>
      </div>
    </Card>
  );
}

export default App;