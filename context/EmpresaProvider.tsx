import { firestore } from "@/firebase/firebaseInit";
import { Empresa } from "@/model/Empresa";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
} from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";

export const EmpresaContext = createContext({});

export const EmpresaProvider = ({ children }: any) => {
	const [empresas, setEmpresas] = useState<Empresa[]>([]);

	useEffect(() => {
		const q = query(collection(firestore, "empresas"), orderBy("nome"));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			if (querySnapshot) {
				let data: Empresa[] = [];
				querySnapshot.forEach((doc) => {
					data.push({
						uid: doc.id,
						nome: doc.data().nome,
						tecnologias: doc.data().tecnologias,
						endereco: doc.data().endereco,
						latitude: doc.data().latitude,
						longitude: doc.data().longitude,
						urlFoto: doc.data().urlFoto,
					});
				});
				console.log("empresas", data);
				setEmpresas(data);
			}
		});
		// insert({
		// 	nome: "teste 1 insert",
		// 	tecnologias: "react, react-native",
		// 	endereco: "Rua Teste 1 insert",
		// 	latitude: -31.766453286495448,
		// 	longitude: -52.351914793252945,
		// 	urlFoto:
		// 		"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
		// } as Empresa);

		// update("LnK6EKHZOw3QOIOcleBV", {
		// 	nome: "teste update",
		// 	tecnologias: "react, react-native",
		// 	endereco: "Rua Teste update",
		// 	latitude: -31.766453286495448,
		// 	longitude: -52.351914793252945,
		// 	urlFoto:
		// 		"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
		// } as Empresa);

		// del("LnK6EKHZOw3QOIOcleBV");

		return () => {
			unsubscribe();
		};
	}, []);

	async function insert(empresa: Empresa, urlDevice: string) {
		try {
			await addDoc(collection(firestore, "empresas"), empresa);
			return "ok";
		} catch (error) {
			console.error("Error adding document: ", error);
			return "Erro, contate o administrador.";
		}
	}

	async function update(uid: string, empresa: Empresa, urlDevice: string) {
		try {
			await setDoc(doc(firestore, "empresas", uid), empresa);
			return "ok";
		} catch (error) {
			console.error("Error adding document: ", error);
			return "Erro, contate o administrador.";
		}
	}

	async function del(uid: string) {
		try {
			await deleteDoc(doc(firestore, "empresas", uid));
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	}

	return (
		<EmpresaContext.Provider value={{ insert, update, del, empresas }}>
			{children}
		</EmpresaContext.Provider>
	);
};
