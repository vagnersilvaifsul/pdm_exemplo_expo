import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

export default function Entrar() {
	const { signIn } = useContext<any>(AuthContext);

	async function entrar() {
		console.log("Chamou entrar");
		const response = await signIn();
		if (response === "ok") {
			console.log(response);
		} else {
			console.log(response);
		}
		//router.replace("/(tabs)");
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
