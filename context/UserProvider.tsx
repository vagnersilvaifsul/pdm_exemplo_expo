import { firestore } from "@/firebase/firebaseInit";
import { Usuario } from "@/model/Usuario";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const UserContext = createContext({});

export const UserProvider = ({ children }: any) => {
	const { userAuth } = useContext(AuthContext);
	const [usuerFirebase, setUserFirebase] = useState<Usuario | null>(null);

	useEffect(() => {
		if (userAuth) {
			getUser();
		}
	}, [userAuth]);

	//busca os detalhes do usuário
	async function getUser(): Promise<void> {
		try {
			if (!userAuth.user) {
				return;
			}
			const docSnap = await getDoc(
				doc(firestore, "usuarios", userAuth.user.uid)
			);
			if (docSnap.exists()) {
				let userData = docSnap.data();
				const usuario: Usuario = {
					uid: docSnap.id,
					email: userData.email,
					nome: userData.nome,
					urlFoto: userData.urlFoto,
					curso: userData.curso,
					perfil: userData.perfil,
				};
				setUserFirebase(usuario);
			}
		} catch (e) {
			console.error("UserProvider, getUser: " + e);
		}
	}

	return (
		<UserContext.Provider value={{ usuerFirebase }}>
			{children}
		</UserContext.Provider>
	);
};
