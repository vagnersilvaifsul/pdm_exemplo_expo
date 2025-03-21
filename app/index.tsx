/* eslint-disable react-hooks/exhaustive-deps */
import { AuthContext } from "@/context/AuthProvider";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreloadScreen() {
	const theme = useTheme();
	const { recuperaCredencialdaCache, signIn } = useContext<any>(AuthContext);

	useEffect(() => {
		//ao montar o componente tenta logar com as credenciais da cache
		logar();
	}, []);

	async function logar() {
		const credencial = await recuperaCredencialdaCache();
		if (credencial) {
			//se tem credenciais armazenadas tenta logar
			const mensagem = await signIn(credencial);
			if (mensagem === "ok") {
				router.replace("/home");
			} else {
				//se não consegue logar vai para a tela de login
				router.replace("/signIn");
			}
		} else {
			router.replace("/signIn");
		}
	}

	return (
		<SafeAreaView
			style={{ ...styles.container, backgroundColor: theme.colors.background }}
		>
			<Image
				style={styles.imagem}
				source={require("../assets/images/logo512.png")}
				accessibilityLabel="logo do app"
			/>
		</SafeAreaView>
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
