// https://mui.com/components/buttons/
import React, { useRef, useState, useEffect } from "react";
import "./Clock.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEraser,
  faPen,
  faUndo,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import "font-awesome/css/font-awesome.min.css";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { ReactSketchCanvas } from "react-sketch-canvas";

import Amplify from "@aws-amplify/core";
import API from "@aws-amplify/api";
import config from "../aws-exports";
Amplify.configure(config);
API.configure(config);

const Clock = ({ user }) => {
  const canvas = useRef();
  const [now, setNow] = useState(0);
  const [step, setStep] = useState(1);
  const [btnSelect, setBtnSelect] = useState(1);
  const [tilte, setTilte] = useState("");
  const [lang, setLang] = useState("heb");
  const [date, setDate] = useState("getCurrentTime()");
  const [gender, setGender] = useState(-1);
  const [age, setAge] = useState(null);
  const [img_base64, setImg_base64] = useState("");
  const [path, setPath] = useState([]);
  const [sketchTime, setSketchTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [count_path, setCount_path] = useState(0);
  const [count_reset, setCount_reset] = useState(0);
  const [count_undo, setCount_undo] = useState(0);
  // function for going to next step by increasing step state by 1
  const nextStep = () => {
    setStep(step + 1);
  };

  // function for going to previous step by decreasing step state by 1
  const prevStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    async function fetchData() {
      await API.get("apicogni", "/api/tests/clock/title", {
        queryStringParameters: { lang },
      }).then((res) => {
        setTilte(res);
      });
    }
    fetchData();
  }, []);

  const submitTest = async () => {
    await API.put("apicogni", "/api/tests/clock", {
      body: {
        user: user.username,
        date: date,
        gender: gender,
        age: age,
        img_base64: img_base64,
        path: path,
        sketchTime: sketchTime,
        startTime: startTime,
        count_path: count_path,
        count_reset: count_reset,
        count_undo: count_undo,
        isCoded: 0,
        isCircle: "",
        isNumbers: "",
        isDirect: "",
      },
    }).then(() => {
      window.location.href = "../";
    });
  };

  switch (step) {
    default:
      break;

    case 1:
      return (
        <Card className='card'>
          <div className='ageInput'>
            <ToggleButtonGroup
              // className='toggle_container'
              color='primary'
              value={"" + gender}
              exclusive={true}
              selected={true}
              onChange={(e) => {
                setGender(parseInt(e.target.value));
              }}
            >
              <ToggleButton value='0' key='0' bsstyle='primary' size='large'>
                נקבה
              </ToggleButton>
              <ToggleButton value='1' key='1' bsstyle='primary' size='large' w>
                זכר
              </ToggleButton>
            </ToggleButtonGroup>

            <span> </span>

            <TextField
              variant='filled'
              id='filled-basic'
              label='גיל'
              helperText='הכנס גיל מטופל'
              type='number'
              defaultValue={age}
              inputProps={{ style: { textAlign: "right" } }}
              InputLabelProps={{
                style: { textAlign: "right", width: "100%" },
              }}
              FormHelperTextProps={{
                style: { textAlign: "right", width: "80%" },
              }}
              onChange={(e) => {
                setAge(parseInt(e.target.value));
              }}
            />
          </div>
          <div className='btn'>
            <Button
              variant='contained'
              size='medium'
              disabled={gender === -1 || age === 0}
              onClick={() => {
                setNow(Date.now());
                nextStep();
              }}
            >
              הבא
            </Button>
          </div>
        </Card>
      );

    case 2:
      return (
        <Card className='card'>
          <div width='100%'>
            <div className='gender'>
              <div className='gen'>מין : {gender ? "זכר" : "נקבה"}</div>
              <div className='age'>{age} : גיל</div>
            </div>
            <div>
              <div className='drawCan'>
                <ReactSketchCanvas
                  ref={canvas}
                  strokeWidth='2'
                  strokeColor='black'
                  width='400px'
                  height='400px'
                  withTimestamp='true'
                />
              </div>
              <div className='iconHandler'>
                <IconButton
                  aria-label='delete'
                  size='medium'
                  color={btnSelect === 1 ? "primary" : "inherit"}
                  onClick={() => {
                    // pen
                    canvas.current.eraseMode(false);
                    setBtnSelect(1);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  size='medium'
                  color={btnSelect === 2 ? "primary" : "inherit"}
                  onClick={() => {
                    // earser
                    canvas.current.eraseMode(true);
                    setBtnSelect(2);
                  }}
                >
                  <FontAwesomeIcon icon={faEraser} />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  size='medium'
                  color='inherit'
                  onClick={() => {
                    // undo
                    canvas.current.undo();
                    setCount_undo(count_undo + 1);
                  }}
                >
                  <FontAwesomeIcon icon={faUndo} />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  size='medium'
                  color='inherit'
                  onClick={() => {
                    // clear
                    canvas.current.clearCanvas();
                    setCount_reset(count_reset + 1);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </div>
              <div className='btn'>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={() => {
                    setNow(Date.now());
                    nextStep();
                  }}
                >
                  הבא
                </Button>
              </div>
              <div className='btn'>
                <Button
                  variant='outlined'
                  size='medium'
                  onClick={() => {
                    prevStep();
                  }}
                >
                  חזור למסך הקודם
                </Button>
              </div>
            </div>
          </div>
        </Card>
      );

    case 3:
      return (
        <Card className='card'>
          <div width='100%'>
            <div className='title'>{tilte}</div>
            <div className='gender'>
              <div className='gen'>מין : {gender ? "זכר" : "נקבה"}</div>
              <div className='age'>{age} : גיל</div>
            </div>
            <div>
              <div className='drawCan'>
                <ReactSketchCanvas
                  ref={canvas}
                  strokeWidth='2'
                  strokeColor='black'
                  width='400px'
                  height='400px'
                  withTimestamp='true'
                />
              </div>
              <div className='iconHandler'>
                <IconButton
                  aria-label='delete'
                  size='medium'
                  color={btnSelect === 1 ? "primary" : "inherit"}
                  onClick={() => {
                    // pen
                    canvas.current.eraseMode(false);
                    setBtnSelect(1);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  size='medium'
                  color={btnSelect === 2 ? "primary" : "inherit"}
                  onClick={() => {
                    // earser
                    canvas.current.eraseMode(true);
                    setBtnSelect(2);
                  }}
                >
                  <FontAwesomeIcon icon={faEraser} />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  size='medium'
                  color='inherit'
                  onClick={() => {
                    // undo
                    canvas.current.undo();
                    setCount_undo(count_undo + 1);
                  }}
                >
                  <FontAwesomeIcon icon={faUndo} />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  size='medium'
                  color='inherit'
                  onClick={() => {
                    // clear
                    canvas.current.clearCanvas();
                    setCount_reset(count_reset + 1);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </div>
              <div className='btn'>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={() => {
                    //img
                    canvas.current
                      .exportImage("png")
                      .then((data) => {
                        setImg_base64(data);
                      })
                      .then((data) => {
                        //date
                        setDate(Date.now());
                      })
                      .then((data) => {
                        //path
                        canvas.current.exportPaths().then((data) => {
                          setPath(data);
                        });
                      })
                      .then(() => {
                        setCount_path(path.length);
                      })
                      .then(() => {
                        //time
                        canvas.current.getSketchingTime().then((data) => {
                          const first = path[0].startTimestamp;
                          const last = path.slice(-1)[0].endTimestamp;

                          setSketchTime(last - first);
                        });
                      })
                      .then(() => {
                        //time from start to first draw
                        const first = path[0].startTimestamp;
                        setStartTime(first - now);
                      })
                      .then(() => {
                        submitTest();
                      });
                  }}
                >
                  הגשה
                </Button>
              </div>
              <div className='btn'>
                <Button
                  variant='outlined'
                  size='medium'
                  onClick={() => {
                    prevStep();
                  }}
                >
                  חזור למסך הקודם
                </Button>
              </div>
            </div>
          </div>
        </Card>
      );
  }
};

export default Clock;
