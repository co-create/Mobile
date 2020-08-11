import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';

export default class App extends React.Component {
	state = {
		isLoading: true,
		distance: 0,
		mode: 'in',
		maxDistance: 400,
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

	computeDistance():string {
		if (this.state.mode == "in") {
			return (this.state.distance).toString();
		} else {
			return (this.state.distance * 2.54).toString();
		}
	}

	onSubmitEditing() {
		this.setState({
			maxDistance: parseInt(this.state.maxDistance)
		});
	}

	render() {
		return (
		<View style={styles.container}>
			<View style={styles.column}>
				<View style={styles.graph}>
					{this.state.isLoading ? <ActivityIndicator/> : (
					<View style={{
						backgroundColor: "blue",
						height: 400 * this.state.distance / this.state.maxDistance,
					}}/>
					)}
				</View>
				<Text style={{textAlign:"center"}}>{this.computeDistance()} {this.state.mode}</Text>
			</View>
			<View style={styles.column}>
				<View style={styles.button_bar}>
					<TouchableOpacity
						onPress={() => this.toggleMeasurement("cm")}
						style={styles.button}
					>
						<Text>IN</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => this.toggleMeasurement("in") }
						style={styles.button}
					>
						<Text>CM</Text>
					</TouchableOpacity>
				</View>
				<TextInput
					onSubmitEditing={() => this.onSubmitEditing()}
					value={this.state.maxDistance.toString()}
				/>
			</View>
		</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	column: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: 'white',
		borderColor: "black",
		borderWidth: 2,
		alignItems: 'center',
		padding: 50,
		margin: 10,
	},
	graph: {
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 2,
		height: 400,
		width: '60%',
		margin: 50,
		padding: 10,
		justifyContent: 'flex-end',
	},
	button_bar: {
		flexDirection: 'row',
	},
	button: {
		alignItems: "center",
		backgroundColor: "#DDDDDD",
		padding: 10,
		margin: 10,
	},
});
