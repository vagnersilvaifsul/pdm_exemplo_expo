import { EmpresaContext } from "@/context/EmpresaProvider";
import { Empresa } from "@/model/Empresa";
import {
	buscarCep,
	buscarCoordendadasPeloEndereco,
} from "@/servicos/apis_localizacao";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, Text, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";
const schema = yup.object().shape({
	nome: yup
		.string()
		.required(requiredMessage)
		.min(2, "O nome deve ter ao menos 2 caracteres"),
	tecnologias: yup
		.string()
		.required(requiredMessage)
		.min(2, "A tecnologia deve ter ao menos 2 caracteres"),
	cep: yup
		.string()
		.required(requiredMessage)
		.min(8, "O CEP deve ter exatamente 8 números")
		.matches(/^[0-9]+$/, "O CEP deve conter apenas números"),
	endereco: yup
		.string()
		.required(requiredMessage)
		.min(2, "Digite um endereço válido"),
});

export default function EmpresaDetalhe() {
	const theme = useTheme();
	const { empresa } = useLocalSearchParams();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<any>({
		defaultValues: {
			nome: JSON.parse(empresa.toString())?.nome,
			tecnologias: JSON.parse(empresa.toString())?.tecnologias,
			cep: JSON.parse(empresa.toString())?.cep,
			endereco: JSON.parse(empresa.toString())?.endereco,
		},
		mode: "onSubmit",
		resolver: yupResolver(schema),
	});
	const [requisitando, setRequisitando] = useState(false);
	const [urlDevice, setUrlDevice] = useState<string | undefined>("");
	const [atualizando, setAtualizando] = useState(false);
	const [mensagem, setMensagem] = useState({ tipo: "", mensagem: "" });
	const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
	const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
	const { save, del } = useContext<any>(EmpresaContext);
	const [excluindo, setExcluindo] = useState(false);

	async function salvar(value: Empresa) {
		value.uid = JSON.parse(empresa.toString())?.uid || null;
		value.urlFoto =
			JSON.parse(empresa.toString())?.urlFoto ||
			"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
		const coordenadas = await buscarCoordenadas(value.endereco);
		if (!coordenadas) {
			setMensagem({
				tipo: "erro",
				mensagem:
					"Ops! Não foi possível identificaar coordenadas geográficas para este endereço. Por favor, verifique se o endereço está correto.",
			});
			setDialogErroVisivel(true);
			return;
		}
		value.latitude = coordenadas.latitude;
		value.longitude = coordenadas.longitude;
		setRequisitando(true);
		setAtualizando(true);
		const msg = await save(value, urlDevice);
		if (msg === "ok") {
			setMensagem({
				tipo: "ok",
				mensagem: "Show! Operação realizada com sucesso.",
			});
			setDialogErroVisivel(true);
			setRequisitando(false);
			setAtualizando(false);
		} else {
			setMensagem({ tipo: "erro", mensagem: msg });
			setDialogErroVisivel(true);
			setRequisitando(false);
			setAtualizando(false);
		}
	}

	async function excluirEmpresa() {
		setDialogExcluirVisivel(false);
		setRequisitando(true);
		setExcluindo(true);
		const msg = await del(JSON.parse(empresa.toString()).uid);
		if (msg === "ok") {
			setDialogErroVisivel(true);
			setRequisitando(false);
			setAtualizando(false);
			setMensagem({
				tipo: "ok",
				mensagem: "A empresa foi excluída com sucesso.",
			});
		} else {
			setMensagem({ tipo: "erro", mensagem: "ops! algo deu errado" });
			setDialogErroVisivel(true);
			setRequisitando(false);
			setExcluindo(false);
		}
	}

	function avisarDaExclusaoPermanenteDoRegistro() {
		setDialogExcluirVisivel(true);
	}

	function buscaNaGaleria() {
		alert("Em desenvolvimento");
	}

	function tiraFoto() {
		alert("Em desenvolvimento");
	}

	async function buscaEndereco(cep: string) {
		if (cep.length < 8 && !/^[0-9]{8}$/.test(cep)) {
			//regex para validar se o CEP tem 8 dígitos e eles estão entre 0 e 9
			return;
		}
		const data = await buscarCep(cep);
		if (data) {
			setValue(
				"endereco",
				JSON.parse(data).logradouro +
					" " +
					JSON.parse(data).localidade +
					" - " +
					JSON.parse(data).uf
			);
		} else {
			setMensagem({
				tipo: "erro",
				mensagem: "Ops! Confira o CEP que você digitou.",
			});
			setDialogErroVisivel(true);
		}
	}

	async function buscarCoordenadas(endereco: string): Promise<any> {
		if (!endereco.length) {
			return null;
		}
		const data = await buscarCoordendadasPeloEndereco(endereco);
		if (data) {
			const parsedData = JSON.parse(data);
			return {
				latitude: parsedData.result.geocode.location.latitude,
				longitude: parsedData.result.geocode.location.longitude,
			};
		} else {
			return null;
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
						source={
							urlDevice !== ""
								? { uri: urlDevice }
								: JSON.parse(empresa.toString()) &&
									  JSON.parse(empresa.toString())?.urlFoto !== ""
									? { uri: JSON.parse(empresa.toString())?.urlFoto }
									: require("../assets/images/logo512.png")
						}
					/>
					<View style={styles.divButtonsImage}>
						<Button
							style={styles.buttonImage}
							mode="outlined"
							icon="image"
							onPress={() => buscaNaGaleria()}
						>
							Galeria
						</Button>
						<Button
							style={styles.buttonImage}
							mode="outlined"
							icon="camera"
							onPress={() => tiraFoto()}
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
								placeholder="Digite o nome da empresa"
								mode="outlined"
								autoCapitalize="words"
								returnKeyType="next"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								right={<TextInput.Icon icon="office-building" />}
							/>
						)}
						name="nome"
					/>
					{errors.nome && (
						<Text style={{ ...styles.textError, color: theme.colors.error }}>
							{errors.nome?.message?.toString()}
						</Text>
					)}
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={styles.textinput}
								label="Teconologias"
								placeholder="react, react native, expo"
								mode="outlined"
								autoCapitalize="words"
								returnKeyType="next"
								keyboardType="default"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								right={<TextInput.Icon icon="rocket-launch" />}
							/>
						)}
						name="tecnologias"
					/>
					{errors.tecnologias && (
						<Text style={{ ...styles.textError, color: theme.colors.error }}>
							{errors.tecnologias?.message?.toString()}
						</Text>
					)}
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={styles.textinput}
								label="CEP"
								placeholder="Digite somente números"
								mode="outlined"
								keyboardType="numeric"
								returnKeyType="next"
								onBlur={() => buscaEndereco(value)}
								onChangeText={onChange}
								value={value}
								right={
									<TextInput.Icon
										icon="map"
										onPress={() => buscaEndereco(value)}
									/>
								}
							/>
						)}
						name="cep"
					/>
					{errors.cep && (
						<Text style={{ ...styles.textError, color: theme.colors.error }}>
							{errors.cep?.message?.toString()}
						</Text>
					)}
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={styles.textinput}
								label="Endereço"
								placeholder="Digite o endereço"
								mode="outlined"
								autoCapitalize="words"
								returnKeyType="next"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								right={<TextInput.Icon icon="map" />}
							/>
						)}
						name="endereco"
					/>
					{errors.endereco && (
						<Text style={{ ...styles.textError, color: theme.colors.error }}>
							{errors.endereco?.message?.toString()}
						</Text>
					)}
					<Button
						style={styles.button}
						mode="contained"
						onPress={handleSubmit(salvar)}
						loading={requisitando}
						disabled={requisitando}
					>
						{!atualizando ? "Salvar" : "Salvando"}
					</Button>
					{JSON.parse(empresa.toString())?.uid && (
						<Button
							style={styles.buttonOthers}
							mode="outlined"
							onPress={handleSubmit(avisarDaExclusaoPermanenteDoRegistro)}
							loading={requisitando}
							disabled={requisitando}
						>
							{!excluindo ? "Excluir" : "Excluindo"}
						</Button>
					)}
				</>
			</ScrollView>
			<Dialog
				visible={dialogExcluirVisivel}
				onDismiss={() => {
					setDialogErroVisivel(false);
					router.back();
				}}
			>
				<Dialog.Icon icon={"alert-circle-outline"} size={60} />
				<Dialog.Title style={styles.textDialog}>{"Ops!"}</Dialog.Title>
				<Dialog.Content>
					<Text style={styles.textDialog} variant="bodyLarge">
						{
							"Você tem certeza que deseja excluir esse registro?\nEsta operação será irreversível."
						}
					</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => setDialogExcluirVisivel(false)}>
						Cancelar
					</Button>
					<Button onPress={excluirEmpresa}>Excluir</Button>
				</Dialog.Actions>
			</Dialog>
			<Dialog
				visible={dialogErroVisivel}
				onDismiss={() => {
					setDialogErroVisivel(false);
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
		padding: 20,
	},
	image: {
		width: 180,
		height: 180,
		alignSelf: "center",
		borderRadius: 180 / 2,
		marginTop: 50,
	},
	textinput: {
		width: 350,
		height: 50,
		marginTop: 20,
		backgroundColor: "transparent",
	},
	textError: {
		width: 350,
	},
	button: {
		marginTop: 40,
		width: 350,
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
	buttonOthers: {
		marginTop: 20,
		marginBottom: 30,
		width: 350,
	},
});
