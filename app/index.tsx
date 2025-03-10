import { AuthContext } from "@/context/AuthProvider";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Button, Dialog, Text, TextInput, useTheme } from "react-native-paper";

type UserAuth = {
	email: string;
	senha: string;
};

export default function Entrar() {
	const theme = useTheme();
	const { signIn } = useContext<any>(AuthContext);
	const [userAuth, setUserAuth] = useState<UserAuth>({ email: "", senha: "" });
	const [exibirSenha, setExibirSenha] = useState(true);
	const [logando, setLogando] = useState(false);
	const [dialogVisivel, setDialogVisivel] = useState(false);
	const [mensagemDialog, setMensagemDialog] = useState("");

	async function entrar() {
		console.log("Chamou entrar");
		console.log(userAuth);
		const response = await signIn(userAuth.email, userAuth.senha);
		if (response === "ok") {
			console.log(response);
			router.replace("/(tabs)");
		} else {
			setMensagemDialog(response);
			setDialogVisivel(true);
		}
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
					<TextInput
						style={styles.textinput}
						label="Email"
						placeholder="Digite seu email"
						mode="outlined"
						autoCapitalize="none"
						returnKeyType="next"
						keyboardType="email-address"
						onChangeText={(t) => setUserAuth({ ...userAuth, email: t })}
						value={userAuth.email}
						right={<TextInput.Icon icon="email" />}
					/>
					<TextInput
						style={styles.textinput}
						label="Senha"
						placeholder="Digite sua senha"
						mode="outlined"
						autoCapitalize="none"
						returnKeyType="go"
						secureTextEntry={exibirSenha}
						onChangeText={(t) => setUserAuth({ ...userAuth, senha: t })}
						value={userAuth.senha}
						right={
							<TextInput.Icon
								icon="eye"
								color={
									exibirSenha ? theme.colors.onBackground : theme.colors.error
								}
								onPress={() => setExibirSenha((previus) => !previus)}
							/>
						}
					/>
					<Button
						style={styles.button}
						mode="contained"
						onPress={entrar}
						loading={logando}
						disabled={logando}
					>
						{!logando ? "Entrar" : "Entrando"}
					</Button>
				</>
			</ScrollView>
			<Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
				<Dialog.Icon icon="alert-circle-outline" size={60} />
				<Dialog.Title style={styles.textDialog}>Erro</Dialog.Title>
				<Dialog.Content>
					<Text style={styles.textDialog} variant="bodyLarge">
						{mensagemDialog}
					</Text>
				</Dialog.Content>
			</Dialog>
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
	textinput: {
		width: 350,
		height: 50,
		marginTop: 20,
		backgroundColor: "transparent",
	},
	button: {
		marginTop: 50,
		marginBottom: 30,
	},
	textDialog: {
		textAlign: "center",
	},
});
