import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function Entrar() {
	async function entrar() {
		console.log("Chamou entrar");
		const auth = getAuth();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				"teste@email.com",
				"Teste123"
			);
			console.log(userCredential.user);
			console.log(userCredential.user.email);
			//router.replace("/(tabs)");
		} catch (error: any) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
		}
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
