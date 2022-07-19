// https://mui.com/components/buttons/
import React from 'react';
import './Records.css';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow'
import Coded from './Coded'
import PdfViewer from './PdfViewer';
import IconButton from '@mui/material/IconButton';
import PreviewIcon from '@mui/icons-material/Preview';
import LinearProgress from '@mui/material/LinearProgress';
import Backdrop from '@mui/material/Backdrop';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DelTest from './DelTest';

import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api';
import config from '../aws-exports'
Amplify.configure(config); 
API.configure(config);


const columns = [
  { 
    id: 'deletee',
    label: 'מחיקה',
    align: 'center',
  },
  // { 
  //   id: 'exportt',
  //   label: 'הפצה',
  //   align: 'center',
  // },
  { 
    id: 'preview',
    label: 'תצוגה מקדימה',
    align: 'center',
  },
  { 
    id: 'coded', 
    label: 'קידוד', 
    align: 'center', 
  },
  {
    id: 'ID',
    label: 'מזהה ID',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'Date',
    label: 'תאריך יצירה',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'Test',
    label: 'אבחון',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];





class Records extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        page: 0,
        rowsPerPage: 10,
        data: [],
        rows: [],
        isLoading: true,
        
        testID : null,
        testDB : null,
        isBackDropOpen : false,
        isBackDropOpenViewer: false,
        dropdown: "preview",

        lock:false
      }
  }

  createData(Test, Date, ID, coded, preview, exportt, deletee) {
    // const density = population / size;
    return { Test, Date, ID, coded,preview, exportt, deletee };
  }
  
  
  
  
  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    if (this.state.isBackDropOpen !== prevState.isBackDropOpen) {
      this.componentDidMount();
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({page: newPage});
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: +event.target.value});
    this.setState({page: 0});
  };
  reWriteDate(currentdate){
    var datetime = new Date(currentdate)

    var dateRet = ""
    dateRet = ((datetime.getDate()<10?'0':'') + datetime.getDate())
    + "/" + ((datetime.getMonth()<10?'0':'') + (datetime.getMonth() + 1)) 
    + "/" + datetime.getFullYear() + " " 
    + ((datetime.getHours()<10?'0':'') + datetime.getHours()) + ":" 
    + ((datetime.getMinutes()<10?'0':'') + datetime.getMinutes());
    

    return(dateRet)

  }

  codedBtn (test,id,isCoded){
    return(
      <IconButton  aria-label="delete" size="medium" 
        disabled={(test==="si")}
        color={this.state.btnSelect===1?"primary":"inherit"} 
        onClick={() => {
          this.setState({
              testDB: test,
              testID: id,
              isBackDropOpen: true,
              dropdown: "code"
            });
          }}
      >   
        <AssignmentIcon color={(test!=="si" && isCoded)?"primary":""}/>
      </IconButton> 
    )
  }
  previewBtn (test,id,isCoded){
    return(
      <IconButton aria-label="delete" disabled={isCoded?false:true} size="medium" color={this.state.btnSelect===1?"primary":"inherit"} onClick={() => {
        this.setState({
          testDB: test,
          testID: id,
          isBackDropOpenViewer: true,
          dropdown: "preview"
        });
        }}>
        <PreviewIcon/>
      </IconButton> 
    )
  }
  // exportBtn (test,id,isCoded){
  //   return(
  //     <IconButton aria-label="delete" size="medium" disabled={isCoded?false:true} color={this.state.btnSelect==1?"primary":"inherit"} onClick={() => {
  //         Axios.post('http://localhost:3001/api/test/exportmail', 
  //         {
  //           test: test,
  //           id: id,
  //           mail: "omereks@gmail.com" //TODO
  //         })
  //       }}>
  //       <AttachEmailIcon/>
  //     </IconButton> 
  //   )
  // }

  deleteBtn (test,id){
    return(
      <IconButton aria-label="delete" size="medium" color={this.state.btnSelect===1?"primary":"inherit"} onClick={() => {
        this.setState({
          testDB: test,
          testID: id,
          isBackDropOpenViewer: true,
          dropdown: "delTest"
        });
        }}>
        <DeleteForeverIcon/>
      </IconButton> 
    )
  }
  
  
  async componentDidMount() {
    if (!this.state.lock){
      this.setState({
        lock:true
      })
      this.getRecords().then(()=>{
        const data = this.mineData()
        const rows = []
        for (var i = 0; i< data.length; i++){
          var date = this.reWriteDate(data[i][2])
          rows.push(this.createData(
            data[i][0], 
            date,
            data[i][1],
            this.codedBtn(data[i][4],data[i][1],data[i][3]),
            this.previewBtn(data[i][4],data[i][1],data[i][3]),
  
            // TRMP TODO
            this.previewBtn(data[i][4],data[i][1],data[i][3]),
            // this.exportBtn(data[i][4],data[i][1],data[i][3]),
            // END TEMP 
  
            this.deleteBtn(data[i][4],data[i][1]) ))
        }
  
        this.setState({
          rows: rows,
          isLoading: false,
          lock:false
        });
      })
    }
    
    

	}  


  comperator(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

  mineData() {
    const test_name = new Map();
    test_name.set('clock', 'Clock Drawing Test (CDT) - Shulman Test');
    test_name.set('si', 'Sensory Profile');

    var arrReturn = []
    var testName = ""
    var testID = ""
    var date = ""
    var test_db_name = ""
    var isCoded
    try{
      for(var i = 0; i< this.state.data.at(-1).length; i++){
        test_db_name = this.state.data.at(-1)[i]
        testName = test_name.get(test_db_name);
        for(var j = 0; j< this.state.data.at(i).length; j++){
          testID = this.state.data.at(i).at(j)._id
          date = this.state.data.at(i).at(j).date
          isCoded = this.state.data.at(i).at(j).isCoded
          arrReturn.push([testName,testID,date,isCoded, test_db_name])
        }
      }
    }catch(error){

    }
    arrReturn.sort(this.comperator);
    return (arrReturn)

  }

  async getRecords() {

    await API.get("apicogni", "/api/tests", {queryStringParameters: {user:this.props.user.username}}).then((res)=>{
    this.setState({
        data: res
      });
    })
  };

  reloadtable (){
    this.setState({
      isLoading: true
    });
    this.componentDidMount();
  }
  renderSwitchDropdown(dropdown){
    switch(dropdown) {
      default: 
      break;

      case 'code':
        return (
          <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.isBackDropOpen}
          >
            <Coded testDB={this.state.testDB} testID={this.state.testID} open={this.state.isBackDropOpen? "open": "close"} close={() => {
              this.setState({
                isBackDropOpen: false,
                testDB: null,
                testID: null,
              });
              this.reloadtable();
              }}/>
          </Backdrop>
          );

      case 'preview':
        return (
          <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.isBackDropOpenViewer}
          >
            <PdfViewer api={API} testDB={this.state.testDB} testID={this.state.testID} open={this.state.isBackDropOpenViewer? "open": "close"} close={() => {
              this.setState({
                isBackDropOpenViewer: false,
                testDB: null,
                testID: null,
              });
              this.reloadtable();
              }}/>
          </Backdrop>);

      case 'delTest':
        return (
          <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.isBackDropOpenViewer}
          >
            <DelTest testDB={this.state.testDB} testID={this.state.testID} open={this.state.isBackDropOpenViewer? "open": "close"} close={() => {
              this.setState({
                isBackDropOpenViewer: false,
              });
              this.reloadtable();
              }}/>
          </Backdrop>);

          

    }
  }
  
  render() {
    
    return (
      <div>
        {/* BackDrop */}

        {this.renderSwitchDropdown(this.state.dropdown)}

        {/* <Coded testDB={this.state.testDB} testID={this.state.testID} open={this.state.isBackDropOpen? "open": "close"} close={() => {
          this.setState({
            isBackDropOpen: false,
          });
          this.reloadtable();
          }}/> */}
        
        
        
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

          <Grid item xs={12}>
            <Card >
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer >
                  {this.state.isLoading? <LinearProgress/> : 
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            <u>{column.label}</u>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.rows
                        .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map((row) => {
                          return (
                            
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number'
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>}
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={this.state.rows.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </Paper>
            </Card>
            
          </Grid>
        
        </Grid>
      </div>
    );
      
  }
  
  
}
export default Records;
