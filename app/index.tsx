import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function PreloadScreen() {
	const theme = useTheme();
	return (
		<View
			style={{ ...styles.container, backgroundColor: theme.colors.background }}
		>
			<Image
				style={styles.imagem}
				source={require("../assets/images/logo512.png")}
				accessibilityLabel="logo do app"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	imagem: {
		width: 250,
		height: 250,
	},
});
