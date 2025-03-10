import { AuthProvider } from "@/context/AuthProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//Ampliando o tema padrão
const themeLight = {
	...MD3LightTheme,
};

const themeDark = {
	...MD3DarkTheme,
};

const temaDoApp = true; //TODO: passar para Context para mudar o tema do app

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<PaperProvider theme={temaDoApp ? themeLight : themeDark}>
			<AuthProvider>
				<StatusBar style="dark" />
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					{/* <Stack.Screen name="entrar" /> */}
				</Stack>
			</AuthProvider>
		</PaperProvider>
	);
}
