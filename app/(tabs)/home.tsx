import { UserContext } from "@/context/UserProvider";
import { Usuario } from "@/model/Usuario";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Avatar, Card, List, Searchbar, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const theme = useTheme();
	const { usuarios, getUsuariosByName } = useContext<any>(UserContext);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [usuariosSearch, setUsuariosSearch] = useState<Usuario[]>([]);

	async function SearchQuery(): Promise<void> {
		console.log(searchQuery);
		const result = await getUsuariosByName(searchQuery);
		if (result.length > 0) {
			setUsuariosSearch(result);
		}
	}

	function clearSearch() {
		setSearchQuery("");
		setUsuariosSearch([]);
	}

	function irParaTelaUsuario(usuario: Usuario | null) {
		// router.push({
		// 	pathname: "/empresa",
		// 	params: { empresa: JSON.stringify(empresa) },
		// });
		alert("Em desenvolvimento");
	}

	return (
		<SafeAreaView
			style={{ ...styles.container, backgroundColor: theme.colors.background }}
		>
			<List.Section
				style={{ ...styles.list, backgroundColor: theme.colors.background }}
			>
				<List.Subheader style={styles.subhearder}>
					Lista de Usuarios
				</List.Subheader>
				<Searchbar
					style={{
						...styles.searchBar,
						backgroundColor: theme.colors.background,
					}}
					onChangeText={(query) => setSearchQuery(query)}
					onSubmitEditing={SearchQuery}
					onClearIconPress={clearSearch}
					value={searchQuery}
				/>
				<ScrollView>
					{usuariosSearch.length > 0
						? usuariosSearch.map((usuario: Usuario, key: number) => (
								<Card
									key={key}
									style={{
										...styles.card,
										borderColor: theme.colors.secondary,
									}}
									onPress={() => irParaTelaUsuario(usuario)}
								>
									<Card.Title
										title={usuario.nome}
										subtitle={usuario.curso + " - " + usuario.perfil}
										left={() => (
											<Avatar.Image
												size={40}
												source={{ uri: usuario.urlFoto }}
											/>
										)}
									/>
								</Card>
							))
						: usuarios.map((usuario: Usuario, key: number) => (
								<Card
									key={key}
									style={{
										...styles.card,
										borderColor: theme.colors.secondary,
									}}
									onPress={() => irParaTelaUsuario(usuario)}
								>
									<Card.Title
										title={usuario.nome}
										subtitle={usuario.curso + " - " + usuario.perfil}
										left={() => (
											<Avatar.Image
												size={40}
												source={{ uri: usuario.urlFoto }}
											/>
										)}
									/>
								</Card>
							))}
				</ScrollView>
			</List.Section>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	subhearder: {
		fontSize: 20,
		alignSelf: "center",
	},
	list: {
		width: "95%",
	},
	card: {
		height: 100,
		width: "100%",
		borderWidth: 1,
		marginBottom: 10,
	},
	searchBar: {
		marginBottom: 10,
		borderWidth: 1,
	},
});
