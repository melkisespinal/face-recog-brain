import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
//Components
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
//Clarifai API
import Clarifai from 'clarifai';
const clarifaiApp = new Clarifai.App({
 apiKey: 'ab0bbd88f4c6412dafe4e5ef7e3dd69a'
});

//ParticlesJs Configuration Object
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
      input: '',
      imgUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  /**
   * Callback function that get's called every time the route changes.
   * It gets called by the individual components.
   * @param {*} route: the route to update the State of the app
   */
  onRouteChange = (route) => {
    //if route is signout, update state
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    }
    else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    //we always want to update the State's route
    this.setState({route: route});
  }

  /**
   * Changes the State of the box that will be displayed on a face.
   * When this happens, the FaceRecognition component draws the new
   * box.
   * @param {*} box: Object containing the parameters to draw the box
   */
  displayFaceBoxes = (box) => {
    this.setState({box: box});
  }

  /**
   * Uses the data given by the Clarifai API to calculate the location of the face
   * boxes.
   * @param {*} data: Data received from Clarifai API to calculate the face boxes
   */
  calculateFaceLocation = (data) => {
    const clarifaiFace = data?.outputs[0]?.data?.regions[0]?.region_info?.bounding_box;
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

  /**
   * Callback that gets called by the ImageLinkForm component when the input
   * detects any change. It changes the state to update the user's provided URL.
   * @param {*} event: The event when the input is updated
   */
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  /**
   * Callback called when the button on ImageLinkForm component is clicked.
   * Does the call to Clarifai API and updates everything.
   */
  onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input});
    clarifaiApp.models
      .predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
      .then(response => this.displayFaceBoxes(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render(){
    const { isSignedIn, imgUrl, route, box } = this.state;

    return (
      <div className="App">
        <Particles className='particles'
              params={particlesJsParams}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { 
          route === 'home' 
          ? 
          <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imgUrl={imgUrl} box={box}/>
            </div>
          : (
            route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
