// https://mui.com/components/buttons/
import React from "react";
import TextField from "@mui/material/TextField";
import "font-awesome/css/font-awesome.min.css";
import Card from "@mui/material/Card";

import "./Si.css";
import { Button, ButtonGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import Amplify from "@aws-amplify/core";
import API from "@aws-amplify/api";
import config from "../aws-exports";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

Amplify.configure(config);
API.configure(config);

const MenuProps = {
  getContentAnchorEl: null,
  PaperProps: {
    style: {
      maxHeight: 200,
      marginLeft: "1px",
      marginTop: "1px",
    },
  },
};

class Si extends React.Component {
  constructor(props) {
    super(props);
    this.setAnswer = this.setAnswer.bind(this);
    this.getQuadrant = this.getQuadrant.bind(this);
    this.getLowRegRank = this.getLowRegRank.bind(this);
    this.getSenSeekRank = this.getSenSeekRank.bind(this);
    this.getSenSenRank = this.getSenSenRank.bind(this);
    this.getSenAvoiRank = this.getSenAvoiRank.bind(this);
    this.calculate = this.calculate.bind(this);

    this.state = {
      step: 1,
      lang: "heb",
      questionsContent: {},
      answersContent: {
        1: "אף פעם",
        2: "לעיתים רחוקות",
        3: "לפעמים",
        4: "בדרך כלל",
        5: "תמיד",
      },
      words: {},
      // 60 zeros for answers, 0 means not answered yet
      answers: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    };
  }

  async componentDidMount() {
    // Axios.post('http://localhost:3001/api/tests/si/pdf', {})

    //console.log("Component did mount")
    await API.get("apicogni", "/api/tests/si/questions", {
      queryStringParameters: { lang: this.state.lang },
    }).then((res) => {
      this.setState({
        questionsContent: res,
      });
    }); //
    // //console.log("Questions:", this.state.questionsContent)
    // await API.get("apicogni", "/api/tests/si/answers", {queryStringParameters : {lang: "heb"}}).then((res)=> {
    //     this.setState({
    //         answersContent: res.data
    //     });
    // })
  }
  // map between questions and their
  getQuadrant = (answer) => {
    let sectionLowReg = [
      3, 6, 12, 15, 21, 23, 36, 37, 39, 41, 44, 45, 52, 55, 59,
    ]; // Low Registration     "-"
    let sectionSenSeeking = [
      2, 4, 8, 10, 14, 17, 19, 28, 30, 32, 40, 42, 47, 50, 58,
    ]; // Sensation Seeking    "~"
    let sectionSenSen = [
      7, 9, 13, 16, 20, 22, 25, 27, 31, 33, 34, 48, 51, 54, 60,
    ]; // Sensory Sensitivity  "@"
    let sectionSenAvoi = [
      1, 5, 11, 18, 24, 26, 29, 35, 38, 43, 46, 49, 53, 56, 57,
    ]; // Sensation Avoiding   "|"
    if (sectionLowReg.includes(answer)) return "lowReg";
    if (sectionSenSeeking.includes(answer)) return "senSeek";
    if (sectionSenSen.includes(answer)) return "senSen";
    if (sectionSenAvoi.includes(answer)) return "senAvoi";
  };
  getLowRegRank = (age, num) => {
    if (11 <= age <= 17) {
      if (15 <= num && num <= 18) {
        return "--";
      }
      if (19 <= num && num <= 26) {
        return "-";
      }
      if (27 <= num && num <= 40) {
        return "=";
      }
      if (41 <= num && num <= 51) {
        return "+";
      }
      if (52 <= num && num <= 75) {
        return "++";
      }
    }
    if (18 <= age <= 64) {
      if (15 <= num && num <= 18) {
        return "--";
      }
      if (19 <= num && num <= 23) {
        return "-";
      }
      if (24 <= num && num <= 35) {
        return "=";
      }
      if (36 <= num && num <= 44) {
        return "+";
      }
      if (45 <= num && num <= 75) {
        return "++";
      }
    }
    if (65 <= age) {
      if (15 <= num && num <= 19) {
        return "--";
      }
      if (20 <= num && num <= 26) {
        return "-";
      }
      if (27 <= num && num <= 40) {
        return "=";
      }
      if (41 <= num && num <= 51) {
        return "+";
      }
      if (52 <= num && num <= 75) {
        return "++";
      }
    }
  };
  getSenSeekRank = (age, num) => {
    if (11 <= age <= 17) {
      if (15 <= num && num <= 27) {
        return "--";
      }
      if (28 <= num && num <= 41) {
        return "-";
      }
      if (42 <= num && num <= 58) {
        return "=";
      }
      if (59 <= num && num <= 65) {
        return "+";
      }
      if (66 <= num && num <= 75) {
        return "++";
      }
    }
    if (18 <= age <= 64) {
      if (15 <= num && num <= 35) {
        return "--";
      }
      if (36 <= num && num <= 42) {
        return "-";
      }
      if (43 <= num && num <= 56) {
        return "=";
      }
      if (57 <= num && num <= 62) {
        return "+";
      }
      if (63 <= num && num <= 75) {
        return "++";
      }
    }
    if (65 <= age) {
      if (15 <= num && num <= 28) {
        return "--";
      }
      if (29 <= num && num <= 39) {
        return "-";
      }
      if (40 <= num && num <= 52) {
        return "=";
      }
      if (53 <= num && num <= 63) {
        return "+";
      }
      if (64 <= num && num <= 75) {
        return "++";
      }
    }
  };
  getSenSenRank = (age, num) => {
    if (11 <= age <= 17) {
      if (15 <= num && num <= 19) {
        return "--";
      }
      if (20 <= num && num <= 25) {
        return "-";
      }
      if (26 <= num && num <= 40) {
        return "=";
      }
      if (41 <= num && num <= 48) {
        return "+";
      }
      if (49 <= num && num <= 75) {
        return "++";
      }
    }
    if (18 <= age <= 64) {
      if (15 <= num && num <= 18) {
        return "--";
      }
      if (19 <= num && num <= 25) {
        return "-";
      }
      if (26 <= num && num <= 41) {
        return "=";
      }
      if (42 <= num && num <= 48) {
        return "+";
      }
      if (49 <= num && num <= 75) {
        return "++";
      }
    }
    if (65 <= age) {
      if (15 <= num && num <= 18) {
        return "--";
      }
      if (19 <= num && num <= 25) {
        return "-";
      }
      if (26 <= num && num <= 41) {
        return "=";
      }
      if (42 <= num && num <= 48) {
        return "+";
      }
      if (49 <= num && num <= 75) {
        return "++";
      }
    }
  };
  getSenAvoiRank = (age, num) => {
    if (11 <= age <= 17) {
      if (15 <= num && num <= 18) {
        return "--";
      }
      if (19 <= num && num <= 25) {
        return "-";
      }
      if (26 <= num && num <= 40) {
        return "=";
      }
      if (41 <= num && num <= 48) {
        return "+";
      }
      if (49 <= num && num <= 75) {
        return "++";
      }
    }
    if (18 <= age <= 64) {
      if (15 <= num && num <= 19) {
        return "--";
      }
      if (20 <= num && num <= 26) {
        return "-";
      }
      if (27 <= num && num <= 41) {
        return "=";
      }
      if (42 <= num && num <= 49) {
        return "+";
      }
      if (50 <= num && num <= 75) {
        return "++";
      }
    }
    if (65 <= age) {
      if (15 <= num && num <= 19) {
        return "--";
      }
      if (19 <= num && num <= 25) {
        return "-";
      }
      if (26 <= num && num <= 42) {
        return "=";
      }
      if (43 <= num && num <= 49) {
        return "+";
      }
      if (50 <= num && num <= 75) {
        return "++";
      }
    }
  };
  setAnswer = (questionNumber, answer) => {
    let answers = this.state.answers;
    answers[questionNumber] = answer;
    //this.setState({answers}, console.log(this.state.answers))
    this.setState({ answers });
  };

  submit = async (lowRegRank, senAvoiRank, senSeekRank, senSenRank) => {
    const d = new Date();
    let time = d.getTime();
    await API.put("apicogni", "/api/tests/si", {
      body: {
        user: this.props.user.username,
        date: time,
        age: this.state.age,
        answers: this.state.answers,
        lowRegRank: lowRegRank,
        senAvoiRank: senAvoiRank,
        senSeekRank: senSeekRank,
        senSenRank: senSenRank,
        isCoded: 1,
      },
    }).then(() => {
      window.location.href = "../";
    });
  };

  calculate = () => {
    let lowReg = 0;
    let senSeek = 0;
    let senSen = 0;
    let senAvoi = 0;
    for (let i = 0; i < 60; i++) {
      let ans = this.state.answers[i];
      let ansQuadrant = this.getQuadrant(i + 1);
      if (ansQuadrant === "senSeek") senSeek += ans;
      if (ansQuadrant === "lowReg") lowReg += ans;
      if (ansQuadrant === "senSen") senSen += ans;
      if (ansQuadrant === "senAvoi") senAvoi += ans;
    }
    // console.log(lowReg, senAvoi, senSeek, senSen)
    let lowRegRank = this.getLowRegRank(this.state.age, lowReg);
    let senSeekRank = this.getSenSeekRank(this.state.age, senSeek);
    let senSenRank = this.getSenSenRank(this.state.age, senSen);
    let senAvoiRank = this.getSenAvoiRank(this.state.age, senAvoi);
    // console.log("Results:", lowRegRank, senAvoiRank, senSeekRank, senSenRank)
    this.submit(lowRegRank, senAvoiRank, senSeekRank, senSenRank);
    // this.setState({step: 1})
  };

  handleLanguageChange = () => {
    this.setState({ lang: (this.state.lang = "eng") });
  };

  // function for going to next step by increasing step state by 1
  nextStep = () => {
    this.setState({ step: this.state.step + 1 });
  }; //

  // function for going to previous step by decreasing step state by 1
  prevStep = () => {
    this.setState({ step: this.state.step - 1 });
  };

  checkAnsArr = (i, j) => {
    let sliceArr = this.state.answers.slice(i, j - 1);
    let bol = sliceArr.every((ans) => {
      return ans !== 0;
    });
    //   console.log(bol)
    return bol;
  };

  // content={questionsContent['1']} questions={questionsContent} answers={answersContent}
  render() {
    switch (this.state.step) {
      default:
        break;

      // age submission
      case 1:
        return (
          <Card className='card'>
            <div className='selectBox'>
              {" "}
              <Box sx={{ maxWidth: 150, margin: "auto" }} variant='standard'>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>
                    {/* Language */}
                  </InputLabel>
                  <Select
                    MenuProps={MenuProps}
                    defaultValue={"heb"}
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={this.lang}
                    onChange={this.handleLanguageChange}
                  >
                    <MenuItem value={"heb"} selected>
                      עברית
                    </MenuItem>
                    <MenuItem value={"eng"}>English</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div>
              <TextField
                style={{ direction: "rtl" }}
                variant='filled'
                id='filled-basic'
                label='הכנס את הגיל שלך'
                InputProps={{ inputProps: { min: 0 } }}
                type='number'
                defaultValue={this.state.age}
                onChange={(event) => {
                  this.setState({ age: parseInt(event.target.value) });
                }}
                inputProps={{ style: { textAlign: "right" } }}
                InputLabelProps={{
                  style: { textAlign: "right", width: "100%" },
                }}
                FormHelperTextProps={{
                  style: { textAlign: "right", width: "80%" },
                }}
              />
            </div>
            <Button
              style={{ margin: "10px" }}
              variant='contained'
              size='small'
              disabled={
                typeof this.state.age == "undefined" ||
                this.state.age < 1 ||
                this.state.age > 120
              }
              onClick={() => {
                this.nextStep();
              }}
            >
              הבא
            </Button>
          </Card>
        );
      case 2:
        return (
          <Card>
            <div>
              <text>
                <Typography variant='body2' color='text.secondary'>
                  <p>
                    השאלון בלשון זכר מטעמי נוחות, והינו מיועד גם לנשים. בבקשה
                    סמן את התגובות המתארות אותך בצורה הטובה ביותר, אנא אל תשאיר
                    סעיפים ללא מענה.
                  </p>
                  <p>סמן את תשובותיך לפי הפרוט הבא:</p>

                  <p>
                    <b>לעולם לא - </b>
                    בתגובה למצבים המתוארים להלן, אתה לעולם לא מגיב באופן כזה.
                  </p>
                  <p>
                    <b>לעיתים רחוקות - </b>
                    בתגובה למצבים המתוארים להלן, אתה נוהג לא להגיב באופן זה.
                  </p>
                  <p>
                    <b>לפעמים - </b>
                    בתגובה למצבים המתוארים להלן, אתה לעיתים מגיב באופן כזה.{" "}
                  </p>
                  <p>
                    <b>בדרך כלל - </b>
                    בתגובה למצבים המתוארים, אתה בדרך כלל מגיב באופן כזה.
                  </p>

                  <p>
                    <b>תמיד - </b>
                    בתגובה למצבים המתוארים להלן, אתה מגיב באופן כזה בכל פעם.{" "}
                  </p>
                </Typography>
              </text>

              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
              >
                מאשר
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                לא מאשר
              </Button>
            </div>
          </Card>
        );
      case 3:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["1"]}
                answers={this.state.answersContent}
                id={0}
                afterClick={this.setAnswer}
              >
                FIRST
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["2"]}
                answers={this.state.answersContent}
                id={1}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["3"]}
                answers={this.state.answersContent}
                id={2}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["4"]}
                answers={this.state.answersContent}
                id={3}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["5"]}
                answers={this.state.answersContent}
                id={4}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["6"]}
                answers={this.state.answersContent}
                id={5}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(0, 7)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 4:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["7"]}
                answers={this.state.answersContent}
                id={6}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["8"]}
                answers={this.state.answersContent}
                id={7}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["9"]}
                answers={this.state.answersContent}
                id={8}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["10"]}
                answers={this.state.answersContent}
                id={9}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["11"]}
                answers={this.state.answersContent}
                id={10}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["12"]}
                answers={this.state.answersContent}
                id={11}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(7, 13)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 5:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["13"]}
                answers={this.state.answersContent}
                id={12}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["14"]}
                answers={this.state.answersContent}
                id={13}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["15"]}
                answers={this.state.answersContent}
                id={14}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["16"]}
                answers={this.state.answersContent}
                id={15}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["17"]}
                answers={this.state.answersContent}
                id={16}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["18"]}
                answers={this.state.answersContent}
                id={17}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(13, 19)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 6:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["19"]}
                answers={this.state.answersContent}
                id={18}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["20"]}
                answers={this.state.answersContent}
                id={19}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["21"]}
                answers={this.state.answersContent}
                id={20}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["22"]}
                answers={this.state.answersContent}
                id={21}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["23"]}
                answers={this.state.answersContent}
                id={22}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["24"]}
                answers={this.state.answersContent}
                id={23}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(19, 25)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 7:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["25"]}
                answers={this.state.answersContent}
                id={24}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["26"]}
                answers={this.state.answersContent}
                id={25}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["27"]}
                answers={this.state.answersContent}
                id={26}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["28"]}
                answers={this.state.answersContent}
                id={27}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["29"]}
                answers={this.state.answersContent}
                id={28}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["30"]}
                answers={this.state.answersContent}
                id={29}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(25, 31)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 8:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["31"]}
                answers={this.state.answersContent}
                id={30}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["32"]}
                answers={this.state.answersContent}
                id={31}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["33"]}
                answers={this.state.answersContent}
                id={32}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["34"]}
                answers={this.state.answersContent}
                id={33}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["35"]}
                answers={this.state.answersContent}
                id={34}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["36"]}
                answers={this.state.answersContent}
                id={35}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(31, 37)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 9:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["37"]}
                answers={this.state.answersContent}
                id={36}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["38"]}
                answers={this.state.answersContent}
                id={37}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["39"]}
                answers={this.state.answersContent}
                id={38}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["40"]}
                answers={this.state.answersContent}
                id={39}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["41"]}
                answers={this.state.answersContent}
                id={40}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["42"]}
                answers={this.state.answersContent}
                id={41}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(37, 43)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 10:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["43"]}
                answers={this.state.answersContent}
                id={42}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["44"]}
                answers={this.state.answersContent}
                id={43}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["45"]}
                answers={this.state.answersContent}
                id={44}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["46"]}
                answers={this.state.answersContent}
                id={45}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["47"]}
                answers={this.state.answersContent}
                id={46}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["48"]}
                answers={this.state.answersContent}
                id={47}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(43, 49)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 11:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["49"]}
                answers={this.state.answersContent}
                id={48}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["50"]}
                answers={this.state.answersContent}
                id={49}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["51"]}
                answers={this.state.answersContent}
                id={50}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["52"]}
                answers={this.state.answersContent}
                id={51}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["53"]}
                answers={this.state.answersContent}
                id={52}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["54"]}
                answers={this.state.answersContent}
                id={53}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(49, 55)}
              >
                הבא
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 12:
        return (
          <Card className='card'>
            <div>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["55"]}
                answers={this.state.answersContent}
                id={54}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["56"]}
                answers={this.state.answersContent}
                id={55}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["57"]}
                answers={this.state.answersContent}
                id={56}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["58"]}
                answers={this.state.answersContent}
                id={57}
                afterClick={this.setAnswer}
              >
                Second
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["59"]}
                answers={this.state.answersContent}
                id={58}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Question
                answersArr={this.state.answers}
                content={this.state.questionsContent["60"]}
                answers={this.state.answersContent}
                id={59}
                afterClick={this.setAnswer}
              >
                First
              </Question>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.nextStep();
                }}
                disabled={!this.checkAnsArr(55, 61)}
              >
                סיים
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
      case 13:
        return (
          <Card className='card'>
            <p>האם אתה בטוח שברצונך לסיים?</p>
            <div>
              <Button
                style={{ margin: "10px" }}
                variant='contained'
                size='small'
                onClick={() => {
                  this.calculate();
                }}
              >
                סיים
              </Button>
              <Button
                style={{ margin: "10px" }}
                variant='outlined'
                size='small'
                onClick={() => {
                  this.prevStep();
                }}
              >
                חזור
              </Button>
            </div>
          </Card>
        );
    }
    // End of switch case
    return (
      <div>
        <h1>SI Results Page</h1>
        <Button
          style={{ margin: "10px" }}
          variant='contained'
          size='small'
          onClick={() => {
            this.prevStep();
          }}
        >
          תחזור אחורה
        </Button>
      </div>
    );
  }
}

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      answer: 0,
      content: this.props.content,
      afterClick: this.props.afterClick,
    };
  }

  componentDidMount() {
    this.setState({ answer: 0 });
  }

  handleClick(answered) {
    this.setState(
      {
        answer: answered,
      },
      () => {
        // console.log("Question: " + this.props.id + ", " + "Answer: " + this.state.answer)
      }
    );
    this.props.afterClick(this.props.id, answered);
  }

  render() {
    return (
      <div className='Question'>
        <div className='QuestionText'>{this.props.content}</div>
        <div className='AnswerBox'>
          <ButtonGroup className='Buttons' exclusive={true} selected={true}>
            <Button
              variant={
                this.props.answersArr[this.props.id] === 1
                  ? "contained"
                  : "outlined"
              }
              onClick={() => this.handleClick(1)}
            >
              {this.props.answers["1"]}
            </Button>
            <Button
              variant={
                this.props.answersArr[this.props.id] === 2
                  ? "contained"
                  : "outlined"
              }
              onClick={() => this.handleClick(2)}
            >
              {this.props.answers["2"]}
            </Button>
            <Button
              variant={
                this.props.answersArr[this.props.id] === 3
                  ? "contained"
                  : "outlined"
              }
              onClick={() => this.handleClick(3)}
            >
              {this.props.answers["3"]}
            </Button>
            <Button
              variant={
                this.props.answersArr[this.props.id] === 4
                  ? "contained"
                  : "outlined"
              }
              onClick={() => this.handleClick(4)}
            >
              {this.props.answers["4"]}
            </Button>
            <Button
              variant={
                this.props.answersArr[this.props.id] === 5
                  ? "contained"
                  : "outlined"
              }
              onClick={() => this.handleClick(5)}
            >
              {this.props.answers["5"]}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default Si;
