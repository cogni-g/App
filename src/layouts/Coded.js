// https://mui.com/components/buttons/
import React from 'react';
import './Coded.css';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api';
import config from '../aws-exports'
Amplify.configure(config); 
API.configure(config);

class Coded extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        openprop: this.props.open,
        open: false,
        testDB: this.props.testDB,
        testID: this.props.testID,
        png: "",

        isCircle: "",
        isNumbers: "",
        isDirect: "",
        labels:  ["null"],
        labelsCosen:  [],

        loadData: true
      }
  }
  async getClockTest() {
    await API.get("apicogni", "/api/test", {queryStringParameters: {db:this.state.testDB, id:this.state.testID}})
    .then((res)=>{
      this.setState({
        png: res.img_base64,
        isCircle: res.isCircle,
        isDirect: res.isDirect,
        isNumbers: res.isNumbers
      });
      if (res.labels && this.state.labelsCosen.length === 0){
        res.labels.map((value) => (
          this.state.labelsCosen.push(value)
        ))
      }
    }) 
  };
  async getClockLabels() {
    if(JSON.stringify(this.state.labels[0]) === JSON.stringify("null")){
      await API.get("apicogni", "/api/test/clock/labels")
      .then((res)=>{
        this.setState({ labels: [] }, () => {
          res.map((value) => (
            this.state.labels.push(value)
          ))
        });
      }) 
    }
  };

  




  async componentWillReceiveProps(props) {
    this.setState({
      testDB: props.testDB,
      testID: props.testID,
      open: props.open === "open"? true : false
    }, () => {
      if (!(this.state.testDB === null) && this.state.loadData){
        this.setState({
          loadData: false
        })
        this.getClockTest();
        this.getClockLabels();
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


  putClockCode = async() => {
    const data = {
      body:{
        isCoded: 1,

        isCircle: this.state.isCircle,
        isNumbers: this.state.isNumbers,
        isDirect: this.state.isDirect,

        labels: this.state.labelsCosen
      }
    };
    await API.put("apicogni", `/api/tests/clock/${this.state.testID}`,  data)   
  };

  addToList= (event) => {
    const {
      target: { value },
    } = event;
    this.setState({labelsCosen: ! typeof value === 'string' ? value.split(',') : value,})
   
  }
  

  render() {
    
    return (
      <div className="bodyy">
        

          <Grid item xs={12}>
            <Card className="card">
            <IconButton aria-label="delete" size="medium" color={this.state.btnSelect===1?"primary":"inherit"} onClick={() => {
                this.setState({
                  testDB: null,
                  testID: null,
                  pdf : null,
                  loadData: true
                });    
                this.props.close()
                // this.handleClose()
              }}>
              <CloseSharpIcon/>
            </IconButton> 
              
              <div >
                <img className="pic" src={this.state.png} alt={" "}></img>
              </div>
              <div className="code">
                  <ToggleButtonGroup
                    color="primary"
                    value={'' + this.state.isCircle}
                    exclusive ={true}
                    selected={true}
                    onChange={(event) => {this.setState({isCircle: parseInt(event.target.value)});}}
                  >
                    <ToggleButton value='0' key="0" bsStyle="primary">לא</ToggleButton>
                    <ToggleButton value='1' key="1" bsStyle="primary">כן</ToggleButton>
                  </ToggleButtonGroup>
                  <span className='spant'>?האם העיגול סגור</span>
              </div>

              <div className="code">
                <ToggleButtonGroup
                  color="primary"
                  value={'' + this.state.isNumbers}
                  exclusive ={true}
                  selected={true}
                  onChange={(event) => {this.setState({isNumbers: parseInt(event.target.value)});}}
                >
                  <ToggleButton value='0' key="0" bsStyle="primary">לא</ToggleButton>
                  <ToggleButton value='1' key="1" bsStyle="primary">כן</ToggleButton>
                </ToggleButtonGroup>
                <span className='spant'>?האם המספרים קיימים</span>
              </div>

              <div className="code">
                  <ToggleButtonGroup
                    color="primary"
                    value={'' + this.state.isDirect}
                    exclusive ={true}
                    selected={true}
                    onChange={(event) => {this.setState({isDirect: parseInt(event.target.value)});}}
                  >
                    <ToggleButton value='0' key="0" bsStyle="primary">לא</ToggleButton>
                    <ToggleButton value='1' key="1" bsStyle="primary">כן</ToggleButton>
                  </ToggleButtonGroup>
                  <span className='spant'>?האם המחוגים מצביעים על השעה הנכונה</span>
              </div>

              {/* CHIPS */}
              <div className="code">
                <FormControl sx={{ m: 1, width: 300 }}>
                  <Select
                    id="demo-multiple-chip-label"
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                      },
                      // getContentAnchorEl: null
                    }}
                    multiple
                    value={this.state.labelsCosen}
                    onChange={this.addToList}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    // MenuProps={MenuProps}
                  >
                    {(this.state.labels).map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        // style={getStyles(name, personName, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <span className="labelsText"> :אבחנה </span>
              </div>
              
              <Button 
                  variant="contained"
                   size="medium" 
                   disabled={!((Number.isInteger(this.state.isCircle)) && (Number.isInteger(this.state.isDirect)) && (Number.isInteger(this.state.isNumbers)))}
                   onClick={async () => {
                      await this.putClockCode();
                      this.props.close()
                    }}
              >
                     הגש קידוד 
              </Button>
            </Card>
            
          </Grid>
        
      </div>
    );
      
  }
  
  
}
export default Coded;
