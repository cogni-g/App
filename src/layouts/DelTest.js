// https://mui.com/components/buttons/
import React from 'react';
import './DelTest.css';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api';
import config from '../aws-exports'
Amplify.configure(config); 
API.configure(config);


class DelTest extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        openprop: this.props.open,
        open: false,
        testDB: this.props.testDB,
        testID: this.props.testID,
      }
  }


  


  async componentWillReceiveProps(props) {
    this.setState({
      testDB: props.testDB,
      testID: props.testID,
      open: props.open === "open"? true : false
    }, () => {
      if (this.state.testDB !== 1){
      }
    })
    
  }

  handleClose = () => {
    this.setState({open: false});
  };
  handleToggle = () => {
    this.setState({open: !this.state.open});
    this.props.close()
  };


  deleteTest = async (test, id)  => {
    let config = { 
      body: { 
          test: test,
          id: id,
      } 
    }
    await API.del("apicogni", '/api/tests/', config)
    .then(() => {
      this.props.close()
    });
  }
  



  render() {
    
    return (
      <div className="bodyy">
        

          <Grid item xs={12}>
            <Card className="card">

              <IconButton aria-label="delete" size="medium" color={this.state.btnSelect===1?"primary":"inherit"} onClick={() => {
                  this.props.close()
                  // this.handleClose()
                }}>
                <CloseSharpIcon/>
              </IconButton> 
              <div>
                <p>
                  האם ברצונך למחוק אבחון זה?
                </p>
                <p>
                  {this.state.testID}
                </p>
              </div>

              <div className='alert'>
                <Alert className='alertText' variant="outlined" severity="warning" >
                  שימו לב כי פעולה זו היא בלתי הפיכה
                </Alert>
              </div>


              
              
              <Button
                  className='ButtonC' 
                  variant="contained"
                  color="success"
                  size="medium" 
                  onClick={() => {
                    this.props.close()
                  }}
              >
                     בטל 
              </Button>

              <span></span>

              <Button 
                  className='ButtonC' 
                  variant="contained"
                  color="error"
                  size="medium" 
                  onClick={() => {
                    this.deleteTest(this.state.testDB, this.state.testID)
                  }}
              >
                     מחק לצמיתות 
              </Button>
            </Card>
            
          </Grid>
        
      </div>
    );
      
  }
  
  
}
export default DelTest;
