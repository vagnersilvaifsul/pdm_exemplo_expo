import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

/*
    1. Para que funcione o mapa é necessário instalar o react-native-maps e ativar o Google Maps SDK no console do GCP.
    Para abrir o console do GCP para o seu projeto, vá no Cosole do Firebase > Clique na engrenagem ao lado de "Visão Geral do Projeto"
    > Vá na Guia "Constas e serviço" > Vá em "Todas as contas de serviço" e clique no link com o ícone do GCP.
    No Dashboard do GCP confira se o nome do projeto é o mesmo none que você criou no Firebase (no campo de input, acima à esquerda).
    Se você estiver no projeto correto, faça uma pesquisa por "Google Maps SDK for Android" e ative o serviço (confira se foi ativado).
		2. Adicione a chave de API do Google Maps no arquivo app.json, como manda a documentação do react-native-maps.
		3. Faça um rebuid do projeto com AES (gere um novo APK) e instale o APK no seu dispositivo. Ah! Lembre de deixar discponível para o git o arquivo google-services.json
*/

export default function EmpresasMap() {
	return (
		<View style={styles.container}>
			<MapView style={styles.map} provider={PROVIDER_GOOGLE} />
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
