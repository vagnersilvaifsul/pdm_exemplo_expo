import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

export default function Entrar() {
	async function entrar() {
		console.log("Chamou entrar");
	}

	return (
		<View style={styles.container}>
			<TouchableHighlight style={styles.button} onPress={entrar}>
				<Text style={styles.text}>Entrar</Text>
			</TouchableHighlight>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
	},
	button: {
		backgroundColor: "#f194ff",
		fontSize: 20,
		fontWeight: "bold",
		width: 100,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
	},
});
