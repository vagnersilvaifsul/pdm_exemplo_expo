/* eslint-disable react-hooks/exhaustive-deps */
import { AuthContext } from "@/context/AuthProvider";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { Image, Platform, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

//1. Configurar o manipulador de notificações
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

/*
	Outros passos devem ser dados, são eles:
	6. Configuração do Firebase no projeto (envolve obter o google-services.json e configurar o app.json)
	7. Criar o app em modo desenvolvimento (profile development), seguindo os passos de: https://expo.dev/blog/expo-go-vs-development-builds
*/

//TODO: fazer a implementação do in app messaging
//TODO: achar o defeito dos listeners de notificação, pois eles não estão funcionando como esperado
export default function PreloadScreen() {
	const theme = useTheme();
	const { recuperaCredencialdaCache, signIn } = useContext<any>(AuthContext);
	const notificationListener = useRef<Notifications.EventSubscription>();
	const responseListener = useRef<Notifications.EventSubscription>();

	useEffect(() => {
		//ao montar o componente tenta logar com as credenciais da cache
		logar();

		//2. Registra o dispositivo para receber notificações
		registerForPushNotificationsAsync();

		//4. Responda aos toques de notificação quando o app está primeiro plano
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log("addNotificationReceivedListener");
				console.log(notification);
				console.log(notification.request.content.data.rota);
			});

		//5. Responda aos toques de notificação quando o app está em segundo plano ou fechado
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log("addNotificationResponseReceivedListener");
				console.log(response);
			});

		return () => {
			// Limpa os listeners quando o componente é desmontado
			// Isso é importante para evitar vazamentos de memória e garantir que os listeners não continuem ativos após o componente ser desmontado.
			notificationListener.current?.remove();
			responseListener.current?.remove();
		};
	}, []);

	async function registerForPushNotificationsAsync(): Promise<void> {
		if (Platform.OS === "android") {
			//Configura o canal de notificação para Android
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: theme.colors.error,
			});
		}

		//3. Solicitar permissões de notificação
		if (Device.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;

			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				handleRegistrationError(
					"Permissão negada. Você não receberá notificações até que a permissão seja concedida."
				);
				return;
			}
		}
	}

	function handleRegistrationError(errorMessage: string) {
		alert(errorMessage);
		throw new Error(errorMessage);
	}

	async function logar() {
		const credencial = await recuperaCredencialdaCache();
		if (credencial) {
			//se tem credenciais armazenadas tenta logar
			const mensagem = await signIn(credencial);
			if (mensagem === "ok") {
				const lastNotification =
					await Notifications.getLastNotificationResponseAsync();
				switch (lastNotification?.notification.request.content.data.rota) {
					case "usuarios":
						router.replace("/home");
						break;
					case "empresas":
						router.replace("/empresas");
						break;
					default:
						router.replace("/home");
				}
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
