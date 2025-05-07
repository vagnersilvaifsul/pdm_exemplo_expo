import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

/*
    Para que funcione o mapa é necessário instalar o react-native-maps e ativar o Google Maps SDK no console do GCP.
    Para abrir o console do GCP para o seu projeto, vá no Cosole do Firebase > Clique na engrenagem ao lado de "Visão Geral do Projeto"
    > Vá na Guia "Constas e serviço" > Vá em "Todas as contas de serviço" e clique no link com o ícone do GCP.
    No Dashboard do GCP confira se o nome do projeto é o mesmo none que você criou no Firebase (no campo de input, acima à esquerda).
    Se você estiver no projeto correto, faça uma pesquisa por "Google Maps SDK for Android" e ative o serviço (confira se foi ativado).
*/

export default function EmpresasMap() {
	return (
		<View style={styles.container}>
			<MapView style={styles.map} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: "100%",
		height: "100%",
	},
});
