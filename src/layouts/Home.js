// https://mui.com/components/buttons/
import React from 'react';
import './Home.css';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import {Link} from 'react-router-dom'
import clockPic from "../assets/images/clock.jpg"
import siPic from "../assets/images/SI.png"

class Home extends React.Component{
  constructor(props) {
      super(props);
      this.canvas = React.createRef();
      this.state = {
      
      }
  }

  async componentDidMount() {

	}  

  

  
  
  render() {
    
        return (
          <div className="body">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              
            
              <Grid item xs={6}>
                <Card >
                  <CardActionArea>
                    <Link to="/tests/clock" style={{ textDecoration: 'none' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={clockPic}
                        style={{objectFit: "contain", }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Clock Drawing Test (CDT) - Shulman Test
                        </Typography>
                      </CardContent>
                    </Link>
                  </CardActionArea>
                </Card>
                
              </Grid>
              
              
              <Grid item xs={6}>
                
                <Card >
                  <CardActionArea>
                    <Link to="/tests/si" style={{ textDecoration: 'none' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={siPic}
                        style={{objectFit: "contain", }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Sensory Profile
                        </Typography>
                      </CardContent>
                    </Link>
                  </CardActionArea>
                </Card>
                
              </Grid>



            </Grid>
          </div>
          );
      
    }
  
}
export default Home;
