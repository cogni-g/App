// https://mui.com/components/buttons/
import React from 'react';
import './Clock.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEraser, faPen, faStop, faUndo } from '@fortawesome/free-solid-svg-icons'
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import 'font-awesome/css/font-awesome.min.css';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { ReactSketchCanvas } from 'react-sketch-canvas';

import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api';
import config from '../aws-exports'
Amplify.configure(config); 
API.configure(config);

class Clock extends React.Component{
  constructor(props) {
      super(props);
      this.canvas = React.createRef();
      this.state = {
        now: 0,
        
        step: 1,
        btnSelect: 1,
        tilte: "" ,
        lang: "heb",
        
        date: "getCurrentTime()",
        gender: -1 ,
        age: null,

        img_base64: "",
        path: [],
        sketchTime: "",
        startTime: "",
        count_path: 0 ,
        count_reset: 0,
        count_undo: 0
 
      }
  }

  // function for going to next step by increasing step state by 1
  nextStep = () => {
    this.setState({step: this.state.step+1});
  };

  // function for going to previous step by decreasing step state by 1
  prevStep = () => {
    this.setState({step: this.state.step-1});
  };

  async componentDidMount() {
    await API.get("apicogni", "/api/tests/clock/title", {queryStringParameters: {lang: this.state.lang}}).then((res)=>{
      this.setState({
        tilte: res
      });
    })
	}  

  async submitTest() {
    await API.put("apicogni", '/api/tests/clock', {body:
    {
      user: this.props.user.username,
      
      date: this.state.date,
      gender: this.state.gender ,
      age: this.state.age,

      img_base64: this.state.img_base64,
      path: this.state.path,
      sketchTime: this.state.sketchTime,
      startTime: this.state.startTime,
      count_path: this.state.count_path ,
      count_reset: this.state.count_reset,
      count_undo: this.state.count_undo,

      isCoded: 0,
      isCircle: "",
      isNumbers: "",
      isDirect: ""
    }}).then(()=>{
      window.location.href = '../';
    })
  }
  
  render() {
    switch(this.state.step){
      default: 
      break;

      case 1:
        return (
          
          <Card className="card">

            
          <div className="ageInput">
            <ToggleButtonGroup
              // className='toggle_container'
              color="primary"
              value={'' + this.state.gender}
              exclusive ={true}
              selected={true}
              onChange={(event) => {this.setState({gender: parseInt(event.target.value)});}}
            >
              <ToggleButton value='0' key="0" bsStyle="primary" size='large'>נקבה</ToggleButton>
              <ToggleButton value='1' key="1" bsStyle="primary" size='large' w>זכר</ToggleButton>
            </ToggleButtonGroup>
          
          <span> </span>
          
          <TextField  variant="filled" id="filled-basic" label="גיל"  helperText="הכנס גיל מטופל"  type="number" defaultValue={this.state.age}  
            inputProps={{style: { textAlign: "right"}}}
            InputLabelProps={{style: { textAlign: "right", width: "100%", }}}
            FormHelperTextProps={{style: { textAlign: "right", width: "80%", }}}


            onChange={(event) => {this.setState({age: parseInt(event.target.value)});}} 
          />
           
            
          </div>
          <div className="btn">
            <Button variant="contained" size="medium" disabled={(this.state.gender===-1) || (this.state.age===0)} onClick={() =>{
              this.setState({now: Date.now()});
              this.nextStep()
            }}>
              הבא
            </Button>

          </div>
          </Card>
        )




      case 2:
        return (
          <Card className="card">
            <div width="100%">
              <div className="title">
                {this.state.tilte}
              </div>
              <div  className="gender">
                <div className="gen">
                 מין :  {this.state.gender?"זכר":"נקבה"} 
                </div>
                <div className="age">
                 {this.state.age} : גיל
                </div> 
              </div >
              <div>
                <div className="drawCan">
                  <ReactSketchCanvas
                    ref={this.canvas}
                    strokeWidth="2"
                    strokeColor="black"
                    width="400px"
                    height="400px"
                    withTimestamp="true"
                  />
                </div>
                <div className="iconHandler">
                  <IconButton aria-label="delete" size="medium" color={this.state.btnSelect===1?"primary":"inherit"} onClick={() => {
                      // pen
                      this.canvas.current.eraseMode(false)
                      this.setState({btnSelect: 1});
                    }}>
                    <FontAwesomeIcon icon={faPen}/>
                  </IconButton>
                  <IconButton aria-label="delete" size="medium" color={this.state.btnSelect===2?"primary":"inherit"} onClick={() => {
                      // earser
                      this.canvas.current.eraseMode(true)
                      this.setState({btnSelect: 2});
                    }}>
                    <FontAwesomeIcon icon={faEraser}/>
                  </IconButton>
                  <IconButton aria-label="delete" size="medium" color="inherit" onClick={() => {
                      // undo
                      this.canvas.current.undo()
                      this.setState({count_undo: this.state.count_undo+1});
                    }}>
                    <FontAwesomeIcon icon={faUndo}/>
                  </IconButton>
                  <IconButton aria-label="delete" size="medium" color="inherit" onClick={() => {
                      // clear
                      this.canvas.current.clearCanvas()
                      this.setState({count_reset: this.state.count_reset+1});
                    }}>
                    <FontAwesomeIcon icon={faStop}/>
                  </IconButton>

                </div>
                <div className="btn">

                  <Button variant="contained" size="medium" onClick={() =>{
                    
                    //img
                    this.canvas.current.exportImage("png")
                    .then(data => {
                      this.setState({img_base64: data});
                    })
                    .then(data=>{
                    //date
                      this.setState({
                        date: Date.now()
                      })
                    })
                    .then(data=>{
                    //path
                      this.canvas.current.exportPaths()
                      .then(data=>{
                        this.setState({path: data})
                      })
                    })
                    .then(()=>{
                      this.setState({count_path: this.state.path.length})
                    })
                    .then(()=>{
                    //time
                      this.canvas.current.getSketchingTime().then(data=>{
                        const first = this.state.path[0].startTimestamp
                        const last = this.state.path.slice(-1)[0].endTimestamp

                        this.setState({sketchTime: last-first})
                      })
                    })
                    .then(()=>{
                      //time from start to first draw
                      const first = this.state.path[0].startTimestamp
                      this.setState({startTime: first-this.state.now})
                        
                      })
                    .then(()=>{
                      this.submitTest();
                    })
                  }}>
                    הגשה
                  </Button>
                </div>
                <div className="btn">
                  <Button variant="outlined" size="medium" onClick={() =>{
                    this.prevStep()
                  }}>
                    חזור למסך הקודם
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          );
        }
    }
}
export default Clock;
