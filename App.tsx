import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default class App extends React.Component {
	state = {
		isLoading: true,
		distance: 0,
	}
	componentDidMount() {
		setInterval(()=> this.fetchSensorData(), 1000)
	}

	async fetchSensorData() {
		fetch('http://54.153.13.255:8000/iotClient/', {
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

	render() {
		return (
			<View style={{ flex: 1, padding: 24 }}>
			{this.state.isLoading ? <ActivityIndicator/> : (
				<View style={{
					backgroundColor: "white",
					borderColor: "red",
					borderWidth: 2,
					height: 400,
					margin: 50,
					padding: 20,
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'flex-end',
				}}>
					<View style={{
						backgroundColor: "blue",
						height: 400 * this.state.distance / 301,
					}}/>
				</View>
			)}
			<Text style={{textAlign:"center"}}>{this.state.distance * 0.3937} in</Text>
		</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
