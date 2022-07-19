// https://mui.com/components/buttons/
import React from 'react';
import './PdfViewer.css';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Amplify from '@aws-amplify/core'
import API from '@aws-amplify/api';
import config from '../aws-exports'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

Amplify.configure(config); 
API.configure(config);

class PdfViewer extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        openprop: this.props.open,
        open: false,
        testDB: this.props.testDB,
        testID: this.props.testID,

        pdf : null,
        numPagesPDF: null,
        pageNumber: 1,
      }
  }
  async getPdf() {
    await API.get("apicogni", "/api/test/genratepdf",{queryStringParameters: {db:this.state.testDB, id:this.state.testID},
    // 'responseType': 'arraybuffer'
      })
    .then((res)=>{
      var arr = Uint8Array.from(atob(res), c => c.charCodeAt(0))
      // console.log(arr);
      this.setState({
        pdf: arr,
      });
    }) 
  };

  onDocumentLoad = ({numPages}) => {
    if(this.state.numPagesPDF===null){
      this.setState({
        numPagesPDF: numPages,
      })
    }
  }
  
  
  

  async componentWillReceiveProps(props) {
    this.setState({
      testDB: props.testDB,
      testID: props.testID,
      open: props.open === "open"? true : false
    }, () => {
      if (!(this.state.testDB===null)){
        this.getPdf();
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
                  numPagesPDF: null
                });      
                this.props.close()
              }}>
              <CloseSharpIcon/>
            </IconButton> 



            <div className='pdfViwer'>
              {this.state.pdf===null? 
              <Box>
                <CircularProgress disableShrink />
                <p>
                המערכת מייצרת את דוח האבחון עבורך 
                </p>
                <p>
                  יתכן ופעולה זו תקח מעט זמן..
                </p>
              </Box>
              :
              <div>
                <Document className='pdfViwer'                
                  file = {new Blob([this.state.pdf], { type: "application/pdf" })}
                  onLoadSuccess={this.onDocumentLoad}
                >
                  <Page className='pdfViwer' pageNumber={this.state.pageNumber} />
                </Document>

                <div>
                  
                  
                  <IconButton
                    type="button"
                    disabled={this.state.pageNumber <= 1}
                    onClick={()=>this.setState({pageNumber: this.state.pageNumber-1})}
                  >
                    <ArrowBackIosIcon/>

                  </IconButton>
                  Page {this.state.pageNumber || (this.state.numPagesPDF ? 1 : '--')} of {this.state.numPagesPDF || '--'}
                  <IconButton
                    type="button"
                    disabled={this.state.pageNumber >= this.state.numPagesPDF}
                    onClick={()=>this.setState({pageNumber: this.state.pageNumber+1})}
                  >
                    <ArrowForwardIosIcon/>
                  </IconButton>
                </div>
              </div>
              }


            </div>
            <div className='down_btn'>
              <Button className='down_bnt_w'  variant="contained" startIcon={<DownloadIcon />} 
              disabled = {!isNaN(this.state.pdf)}
              onClick={()=>{
                var blob = new Blob([this.state.pdf], { type: "application/pdf" });
                console.log(blob)
                var url = URL.createObjectURL(blob);
                window.open(url);
               
              }}>
                הורד
              </Button>
            </div>
             
            </Card>
            
          </Grid>
        
      </div>

    );
      
  }
  
  
}
export default PdfViewer;
