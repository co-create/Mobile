import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';

export default class App extends React.Component {
	state = {
		isLoading: true,
		distance: 0,
		mode: 'in',
		maxDistance: 400,
		distanceInput: 400,
	}

	constructor(props) {
		super(props);
		this.toggleMeasurement = this.toggleMeasurement.bind(this);
	}

	componentDidMount() {
		setInterval(()=> this.fetchSensorData(), 1000)
	}

	async fetchSensorData() {
		fetch('https://dev.techgronomist.com/api/1/iotClient/', {
		   method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
		   console.log(responseJson);
		   this.setState({
			  distance: responseJson.data[responseJson.data.length - 1],
			  isLoading: false
		   })
		})
		.catch((error) => {
		   console.error(error);
		});
	}

	toggleMeasurement(val: string) {
		if (this.state.mode == 'in' && val == 'in') {
			this.setState({
				mode:'cm',
			});
		} else if (this.state.mode == 'cm' && val == 'cm') {
			this.setState({
				mode:'in',
			});
		}
	}

	computeDistance():number {
		if (this.state.mode == "in") {
			return (this.state.distance);
		} else {
			return (this.state.distance * 2.54);
		}
	}

	computeColor():string {
		let maxDistance: number = this.state.maxDistance;
		let distance: number = this.computeDistance();

		if (distance <= 0.05 * maxDistance) {
			return "red";
		} else if (distance <= 0.2 * maxDistance) {
			return "yellow";
		} else {
			return "green";
		}
	}

	onChangeText(text: string) {
		this.setState({
			distanceInput: parseInt(text)
		});
	}

	render() {
		return (
		<View style={styles.container}>
			<View style={styles.graph}>
				{this.state.isLoading ? <ActivityIndicator/> : (
				<View style={{
					backgroundColor: this.computeColor(),
					height: 400 * this.computeDistance() / this.state.maxDistance,
				}}/>
				)}
			</View>
			<Text style={{textAlign:"center"}}>{this.computeDistance()} {this.state.mode}</Text>
			<Text style={{textAlign:"center"}}>{Math.round(this.computeDistance() / this.state.maxDistance * 100)} %</Text>
			<View style={{height:60}}/>
			<Text style={{fontSize: 18}}>Measurement System</Text>
			<View style={styles.button_bar}>
				<TouchableOpacity
					onPress={() => this.toggleMeasurement("cm")}
					style={styles.button}
				>
					<Text style={{color: "white"}}>IN</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => this.toggleMeasurement("in") }
					style={styles.button}
				>
					<Text style={{color: "white"}}>CM</Text>
				</TouchableOpacity>
			</View>
			<View style={{height:20}}/>
			<Text style={{fontSize: 18}}>Max Height</Text>
			<View style = {styles.button_bar}>
				<TextInput style = {styles.input}
					onChangeText = {(text) => this.onChangeText(text)}
					placeholder = {this.state.distanceInput.toString()}
				/>
				<TouchableOpacity
					style = {styles.button}
					onPress = {
						() => this.setState({maxDistance: this.state.distanceInput})
					}>
					<Text style = {{color:"white"}}> Save </Text>
				</TouchableOpacity>
			</View>
		</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		width: "100%",
	},
	graph: {
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 2,
		height: 400,
		width: '60%',
		padding: 10,
		marginTop: 20,
		marginBottom: 20,
		justifyContent: 'flex-end',
	},
	button_bar: {
		flexDirection: 'row',
		alignItems: "center",
	},
	button: {
		alignItems: "center",
		backgroundColor: "black",
		padding: 10,
		margin: 10,
		height: 40,
	},
	input: {
		height: 40,
		width: 70,
		borderColor: 'black',
		borderWidth: 1
	},
});
