import React, { Component } from 'react';

import VideoContainer from './VideoContainer';

import './App.css';

export default class App extends Component {
	render() {
		return (
			<div className="App">
        <h1 className="App-title">Build Your Chloe Ting Workout!</h1>
				<VideoContainer />
			</div>
		);
	}
}
