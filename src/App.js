import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
//Components
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
//Clarifai API
import Clarifai from 'clarifai';
const clarifaiApp = new Clarifai.App({
 apiKey: 'ab0bbd88f4c6412dafe4e5ef7e3dd69a'
});

const particlesJsParams = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 200
      }
    }
  }
};

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '', //default
      imgUrl: '',//default
      box: {

      }
    }
  }

  displayFaceBoxes = (box) => {
    
    this.setState({box: box});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const imageTag = document.getElementById('inputImage');
    const width = Number(imageTag.width);
    const height = Number(imageTag.height);
    
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input});
    clarifaiApp.models
      .predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
      .then(response => this.displayFaceBoxes(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render(){
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesJsParams}
          />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imgUrl={this.state.imgUrl} box={this.state.box}/>
      </div>
    );
  }
}

export default App;
