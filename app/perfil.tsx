import { UserContext } from "@/context/UserProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
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

export default function Perfil({ navigation }: any) {
	const theme = useTheme();
	const { userFirestore } = useContext<any>(UserContext);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<any>({
		defaultValues: {
			nome: userFirestore.nome,
			email: userFirestore.email,
			curso: userFirestore.curso,
			perfil: userFirestore.perfil,
		},
		mode: "onSubmit",
		resolver: yupResolver(schema),
	});
	const [requisitando, setRequisitando] = useState(false);
	const [atualizando, setAtualizando] = useState(false);
	const [excluindo, setExcluindo] = useState(false);
	const [dialogVisivel, setDialogVisivel] = useState(false);
	const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
	const [mensagem, setMensagem] = useState({ tipo: "", mensagem: "" });
	const { update, del } = useContext<any>(UserContext);
	const [urlDevice, setUrlDevice] = useState<string>("");

	useEffect(() => {}, []);

	async function atualizaPerfil(data: Usuario) {
		setRequisitando(true);
		setAtualizando(true);
		data.uid = userFirestore.uid;
		data.urlFoto = userFirestore.urlFoto;
		const msg = await update(data, urlDevice);
		if (msg === "ok") {
			setMensagem({
				tipo: "ok",
				mensagem: "Show! Seu perfil foi atualizado com sucesso.",
			});
			setDialogVisivel(true);
			setRequisitando(false);
			setAtualizando(false);
		} else {
			setMensagem({ tipo: "erro", mensagem: msg });
			setDialogVisivel(true);
			setRequisitando(false);
			setAtualizando(false);
		}
	}

	function avisarDaExclusaoPermanenteDaConta() {
		setDialogExcluirVisivel(true);
	}

	async function excluirConta() {
		setDialogExcluirVisivel(false);
		setRequisitando(true);
		setExcluindo(true);
		const msg = await del(userFirestore.uid);
		if (msg === "ok") {
			router.replace("/signIn");
		} else {
			setMensagem({ tipo: "erro", mensagem: "ops! algo deu errado" });
			setDialogVisivel(true);
			setRequisitando(false);
			setExcluindo(false);
		}
	}

	async function buscaNaGaleria() {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const path = result.assets[0].uri;
			setUrlDevice(path); //armazena a uri para a imagem no device
		}
	}

	async function tiraFoto() {
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images", "videos"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const path = result.assets[0].uri;
			setUrlDevice(path); //armazena a uri para a imagem no device
		}
	}

	return (
		<SafeAreaView
			style={{ ...styles.container, backgroundColor: theme.colors.background }}
		>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			>
				<>
					<Image
						style={styles.image}
						source={
							urlDevice !== ""
								? { uri: urlDevice }
								: userFirestore.urlFoto !== ""
									? { uri: userFirestore.urlFoto }
									: require("../assets/images/person.png")
						}
						loadingIndicatorSource={require("../assets/images/person.png")}
					/>
					<View style={styles.divButtonsImage}>
						<Button
							style={styles.buttonImage}
							mode="outlined"
							icon="image"
							onPress={buscaNaGaleria}
						>
							Galeria
						</Button>
						<Button
							style={styles.buttonImage}
							mode="outlined"
							icon="camera"
							onPress={tiraFoto}
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
					setDialogExcluirVisivel(false);
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
				visible={dialogVisivel}
				onDismiss={() => {
					setDialogVisivel(false);
					if (mensagem.tipo === "ok") {
						router.back();
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
