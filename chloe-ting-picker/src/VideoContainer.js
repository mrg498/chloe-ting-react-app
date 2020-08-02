import React, { Component } from 'react';
import axios from 'axios';
import './VideoContainer.css';
const YOUR_API_KEY = process.env.REACT_APP_YOUR_API_KEY;

export default class VideoContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadingVideos: JSON.parse(window.localStorage.getItem('loadingVideos') || '[]'),
			customVideos: [],
			videosFullBody: JSON.parse(window.localStorage.getItem('videosFullBody') || '[]'),
			videosUpperBody: JSON.parse(window.localStorage.getItem('videosUpperBody') || '[]'),
			videosLowerBody: JSON.parse(window.localStorage.getItem('videosLowerBody') || '[]'),
			videosAbs: JSON.parse(window.localStorage.getItem('videosAbs') || '[]'),
			videosBack: JSON.parse(window.localStorage.getItem('videosBack') || '[]'),
			videosLegs: JSON.parse(window.localStorage.getItem('videosLegs') || '[]'),
			videosButt: JSON.parse(window.localStorage.getItem('videosButt') || '[]'),
			videosArms: JSON.parse(window.localStorage.getItem('videosArms') || '[]')
		};

		this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount() {
		if (this.state.loadingVideos.length === 0) {
			this.getVideos(undefined, 'loadingVideos', () => {
				console.log('got loading videos');
			});
			this.getVideos('full body workout burn', 'videosFullBody', () => {
				console.log('got fullBody videos');
			});
		}
	}

	async getVideos(search, whichVideos, cb) {
		if (this.state[whichVideos].length === 0) {
			try {
				let order = 'order=relevance&';
				let maxResults = 'maxResults=8&';
				let q;
				if (search === undefined) {
					q = '';
					order = 'order=viewCount&';
				}
				else {
					q = `q=${search}&`;
					maxResults = 'maxResults=15&';
				}

				const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCCgLoMYIyP0U56dEhEL1wXQ&${maxResults}${order}${q}type=video&videoDuration=any&videoEmbeddable=true&key=${YOUR_API_KEY}`;
				console.log(API_URL);
				let res = await axios.get(API_URL, { headers: { Accept: 'application/json' } });
				const videos = res.data.items;
				console.log(videos);
				const videoIds = videos.map((vid) => vid.id.videoId);
				console.log(videoIds);
				this.setState(
					{
						[whichVideos]: videoIds
					},
					() => {
						window.localStorage.setItem(`${whichVideos}`, JSON.stringify(this.state[whichVideos]));
						cb();
					}
				);
			} catch (e) {
				alert(e);
			}
		}
		else {
			cb();
		}
	}

	handleClick(e) {
		console.log(e.target.name);
		console.log(e.target.value);
		const whichVideos = e.target.value;

		this.getVideos(e.target.name, e.target.value, () => {
			console.log('got videos');
			this.setCustomVideos(whichVideos);
		});
	}

	setCustomVideos(whichVideos) {
		//get 1 random full body video
		const length_1 = this.state.videosFullBody.length;
		const rand_1 = Math.floor(Math.random() * length_1);
		const randFullBody = this.state.videosFullBody[rand_1];
		//console.log(randFullBody);
		//then get a random video from the specified videos
		const length_2 = this.state[whichVideos].length;
		const rand_2 = Math.floor(Math.random() * length_2);
		const randSearched = this.state[whichVideos][rand_2];
		// console.log(this.state[whichVideos]);

		this.setState({
			customVideos: [ randFullBody, randSearched ]
		});
	}

	render() {
		const mostViewedVideos = this.state.loadingVideos.map((ele, i) => (
			<iframe
				key={i}
				title={ele}
				width="280"
				height="157"
				src={`https://www.youtube.com/embed/${ele}`}
				frameBorder="1"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		));

		const customVideos = this.state.customVideos.map((ele, i) => (
			<iframe
				key={i}
				title={ele}
				width="300"
				height="150"
				src={`https://www.youtube.com/embed/${ele}`}
				frameBorder="1"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		));

		return (
			<div className="videoContainer">
				<div className="mostViewed">
					<h1 className="mostViewed-title">Choose from some of her most viewed videos!</h1>
					{mostViewedVideos}
				</div>
				<h1 className="or">Or...</h1>
				<div className="buildWorkout">
					<h1 className="buildWorkout-text"> Generate A Custom Workout</h1>
					<div className="customVideos">{customVideos}</div>
					<div className="buttons-title">
						<div className="workoutPlanContainer">
							<div className="buttons">
								<button
									className="button"
									name="full body workout burn"
									value="videosFullBody"
									onClick={this.handleClick}
								>
									Full Body
								</button>
								<button
									className="button"
									name="upper body workout"
									value="videosUpperBody"
									onClick={this.handleClick}
								>
									Upper Body
								</button>
								<button
									className="button"
									name="lower body workout"
									value="videosLowerBody"
									onClick={this.handleClick}
								>
									Lower Body
								</button>
								<button
									className="button"
									name="abs workout core"
									value="videosAbs"
									onClick={this.handleClick}
								>
									Abs
								</button>
							</div>
							<div className="buttons">
								<button
									className="button"
									name="chest arms pushup workout"
									value="videosArms"
									onClick={this.handleClick}
								>
									Chest
								</button>
								<button
									className="button"
									name="back arms workout"
									value="videosBack"
									onClick={this.handleClick}
								>
									Back
								</button>
								<button
									className="button"
									name="legs thigh workout"
									value="videosLegs"
									onClick={this.handleClick}
								>
									Legs
								</button>
								<button
									className="button"
									name="butt booty workout"
									value="videosButt"
									onClick={this.handleClick}
								>
									Butt
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
