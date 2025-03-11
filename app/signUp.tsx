import { AuthContext } from "@/context/AuthProvider";
import { Curso } from "@/model/Curso";
import { Perfil } from "@/model/Perfil";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function SignUpScreen() {
	const { signUp } = useContext(AuthContext);

	async function cadastrar() {
		console.log("Cadastrando...");
		const usuario = {
			email: "vagnersilva@ifsul.edu.br",
			nome: "Vagner IFSul",
			urlFoto:
				"https://www.g'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
			curso: Curso.CSTSI,
			perfil: Perfil.Aluno,
			senha: "Teste12@",
		};
		const response = await signUp(usuario);
		if (response === "ok") {
			console.log(response);
		} else {
			console.log(response);
		}
	}

	return (
		<View style={styles.container}>
			<Text>SignUp Screen</Text>
			<Button onPress={cadastrar}>SignUp</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
