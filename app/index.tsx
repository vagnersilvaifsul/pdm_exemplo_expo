import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function Entrar() {
	const theme = useTheme();
	const { signIn } = useContext<any>(AuthContext);

	async function entrar() {
		console.log("Chamou entrar");
		const response = await signIn("teste@email.com", "Teste123");
		if (response === "ok") {
			console.log(response);
		} else {
			console.log(response);
		}
		//router.replace("/(tabs)");
	}

	return (
		<SafeAreaView
			style={{ ...styles.container, backgroundColor: theme.colors.background }}
		>
			<ScrollView>
				<>
					<Image
						style={styles.image}
						source={require("../assets/images/logo512.png")}
					/>
				</>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	image: {
		width: 200,
		height: 200,
		alignSelf: "center",
		borderRadius: 200 / 2,
		marginTop: 100,
		marginBottom: 40,
	},
});
