import { UserContext } from "@/context/UserProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, Text, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import { Usuario } from "../model/Usuario";

const requiredMessage = "Campo obrigatório";

const schema = yup
	.object()
	.shape({
		nome: yup
			.string()
			.required(requiredMessage)
			.min(2, "O nome deve ter ao menos 2 caracteres"),
		email: yup
			.string()
			.required(requiredMessage)
			.matches(/\S+@\S+\.\S+/, "Email inválido"),
		curso: yup.string().required(requiredMessage),
		perfil: yup.string().required(requiredMessage),
	})
	.required();

export default function PerfilTela({ navigation }: any) {
	const theme = useTheme();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<any>({
		defaultValues: {
			nome: "Nome do usuário",
			email: "email@email.com",
			curso: "curso",
			perfil: "aluno",
		},
		mode: "onSubmit",
		resolver: yupResolver(schema),
	});
	const [requisitando, setRequisitando] = useState(false);
	const [atualizando, setAtualizando] = useState(false);
	const [excluindo, setExcluindo] = useState(false);
	const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
	const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
	const [mensagem, setMensagem] = useState({ tipo: "", mensagem: "" });
	const { getUser } = useContext(UserContext);

	async function atualizaPerfil(data: Usuario) {
		const usuario = await getUser();
		console.log(usuario);
	}

	function avisarDaExclusaoPermanenteDaConta() {
		setDialogExcluirVisivel(true);
	}

	async function excluirConta() {
		alert("Desenvolver a comunicação com o BaaS para o Update do perfil");
	}

	return (
		<SafeAreaView
			style={{ ...styles.container, backgroundColor: theme.colors.background }}
		>
			<ScrollView>
				<>
					<Image
						style={styles.image}
						source={require("../assets/images/person.png")}
						loadingIndicatorSource={require("../assets/images/person.png")}
					/>
					<View style={styles.divButtonsImage}>
						<Button
							style={styles.buttonImage}
							mode="outlined"
							icon="image"
							onPress={() =>
								alert(
									"Isso será desenvolvido na branch modulo2_upload_imagen))"
								)
							}
						>
							Galeria
						</Button>
						<Button
							style={styles.buttonImage}
							mode="outlined"
							icon="camera"
							onPress={() =>
								alert(
									"Isso será desenvolvido na branch modulo2_upload_imagen))"
								)
							}
						>
							Foto
						</Button>
					</View>

					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={styles.textinput}
								label="Nome"
								placeholder="Digite seu nome completo"
								mode="outlined"
								autoCapitalize="words"
								returnKeyType="next"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								right={<TextInput.Icon icon="smart-card" />}
							/>
						)}
						name="nome"
					/>
					{errors.email && (
						<Text style={{ ...styles.textError, color: theme.colors.error }}>
							{errors.nome?.message?.toString()}
						</Text>
					)}

					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={styles.textinput}
								disabled
								label="Email"
								placeholder="Digite seu email"
								mode="outlined"
								autoCapitalize="none"
								returnKeyType="next"
								keyboardType="email-address"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								right={<TextInput.Icon icon="email" />}
							/>
						)}
						name="email"
					/>
					{errors.email && (
						<Text style={{ ...styles.textError, color: theme.colors.error }}>
							{errors.email?.message?.toString()}
						</Text>
					)}

					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={styles.textinput}
								disabled
								label="Curso ou Empresa"
								placeholder="Clique para selecionar outro curso"
								mode="outlined"
								autoCapitalize="none"
								returnKeyType="next"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								right={<TextInput.Icon icon="domain" />}
							/>
						)}
						name="curso"
					/>
					{errors.curso && (
						<Text style={{ ...styles.textError, color: theme.colors.error }}>
							{errors.senha?.message?.toString()}
						</Text>
					)}
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={styles.textinput}
								disabled
								label="Perfil"
								placeholder="Clique para selecionar outro perfil"
								mode="outlined"
								autoCapitalize="none"
								returnKeyType="go"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								right={<TextInput.Icon icon="account-eye" />}
							/>
						)}
						name="perfil"
					/>
					{errors.perfil && (
						<Text style={{ ...styles.textError, color: theme.colors.error }}>
							{errors.perfil?.message?.toString()}
						</Text>
					)}
					<Button
						style={styles.button}
						mode="contained"
						onPress={handleSubmit(atualizaPerfil)}
						loading={requisitando}
						disabled={requisitando}
					>
						{!atualizando ? "Atualizar" : "Atualizando"}
					</Button>
					<Button
						style={styles.buttonOthers}
						mode="outlined"
						onPress={handleSubmit(avisarDaExclusaoPermanenteDaConta)}
						loading={requisitando}
						disabled={requisitando}
					>
						{!excluindo ? "Excluir" : "Excluindo"}
					</Button>
				</>
			</ScrollView>
			<Dialog
				visible={dialogExcluirVisivel}
				onDismiss={() => {
					setDialogErroVisivel(false);
				}}
			>
				<Dialog.Icon icon={"alert-circle-outline"} size={60} />
				<Dialog.Title style={styles.textDialog}>{"Ops!"}</Dialog.Title>
				<Dialog.Content>
					<Text style={styles.textDialog} variant="bodyLarge">
						{
							"Você tem certeza que deseja excluir sua conta?\nEsta operação será irreversível."
						}
					</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => setDialogExcluirVisivel(false)}>
						Cancelar
					</Button>
					<Button onPress={excluirConta}>Excluir</Button>
				</Dialog.Actions>
			</Dialog>
			<Dialog
				visible={dialogErroVisivel}
				onDismiss={() => {
					setDialogErroVisivel(false);
					if (mensagem.tipo === "ok") {
						navigation.goBack();
					}
				}}
			>
				<Dialog.Icon
					icon={
						mensagem.tipo === "ok"
							? "checkbox-marked-circle-outline"
							: "alert-circle-outline"
					}
					size={60}
				/>
				<Dialog.Title style={styles.textDialog}>
					{mensagem.tipo === "ok" ? "Informação" : "Erro"}
				</Dialog.Title>
				<Dialog.Content>
					<Text style={styles.textDialog} variant="bodyLarge">
						{mensagem.mensagem}
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
		marginTop: 50,
	},
	textinput: {
		width: 350,
		height: 50,
		marginTop: 20,
		backgroundColor: "transparent",
	},
	textEsqueceuSenha: {
		alignSelf: "flex-end",
		marginTop: 20,
	},
	textCadastro: {},
	textError: {
		width: 350,
	},
	button: {
		marginTop: 40,
	},
	buttonOthers: {
		marginTop: 20,
		marginBottom: 30,
	},
	divButtonsImage: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
		marginBottom: 20,
	},
	buttonImage: {
		width: 180,
	},
	textDialog: {
		textAlign: "center",
	},
});
