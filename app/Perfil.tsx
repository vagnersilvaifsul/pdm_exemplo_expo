import { StyleSheet, Text, View } from "react-native";

export default function Perfil() {
	return (
		<View style={styles.container}>
			<Text>Perfil</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 20,
		paddingTop: 20,
		alignItems: "center",
		justifyContent: "center",
	},
});
