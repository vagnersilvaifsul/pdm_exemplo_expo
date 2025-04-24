import { Empresa } from "@/model/Empresa";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmpresaDetalhe() {
	const { empresa } = useLocalSearchParams();
	const [data, setData] = useState<Empresa | null>(null);

	useEffect(() => {
		console.log(JSON.parse(empresa.toString()));
		setData(JSON.parse(empresa.toString()));
	}, [empresa]);

	return (
		<SafeAreaView>
			<Text>Detalhe da Empresa</Text>
		</SafeAreaView>
	);
}
