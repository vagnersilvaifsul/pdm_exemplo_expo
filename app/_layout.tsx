import { AuthProvider } from "@/context/AuthProvider";
import { EmpresaProvider } from "@/context/EmpresaProvider";
import { FcmProvider } from "@/context/FcmProvider";
import { UserProvider } from "@/context/UserProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import {
	MD3DarkTheme,
	MD3LightTheme,
	PaperProvider,
	useTheme,
} from "react-native-paper";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//Ampliando o tema padrão
const themeLight = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		white: "#ffffff",
		black: "#000000",
	},
};

const themeDark = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		white: "#ffffff",
		black: "#000000",
	},
};

//Tipo do tema ampliado e hook tipado para acessar as cores extras (ex.: theme.colors.white)
export type AppTheme = typeof themeLight;
export const useAppTheme = () => useTheme<AppTheme>();

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	const colorScheme = useColorScheme();

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<PaperProvider theme={colorScheme === "dark" ? themeDark : themeLight}>
			<AuthProvider>
				<FcmProvider>
					<UserProvider>
						<EmpresaProvider>
							<StatusBar style="dark" />
							<Stack
								screenOptions={{
									headerShown: false,
								}}
							>
								<Stack.Screen name="signIn" />
								<Stack.Screen name="signUp" />
								<Stack.Screen name="recuperarSenha" />
								<Stack.Screen name="perfil" />
								<Stack.Screen name="empresa" />
							</Stack>
						</EmpresaProvider>
					</UserProvider>
				</FcmProvider>
			</AuthProvider>
		</PaperProvider>
	);
}
