import { firestore } from "@/firebase/firebaseInit";
import { Empresa } from "@/model/Empresa";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	where,
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
				setEmpresas(data);
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	async function save(empresa: Empresa, urlDevice: string) {
		try {
			if (empresa.uid) {
				await setDoc(doc(firestore, "empresas", empresa.uid), empresa); //update
			} else {
				await addDoc(collection(firestore, "empresas"), empresa); //insert
			}
			return "ok";
		} catch (error) {
			console.error("Error adding document: ", error);
			return "Erro, contate o administrador.";
		}
	}

	async function del(uid: string): Promise<string> {
		try {
			await deleteDoc(doc(firestore, "empresas", uid));
			return "ok";
		} catch (error) {
			console.error("Error adding document: ", error);
			return "Erro, contate o administrador.";
		}
	}

	async function getEmpresasByName(nome: string): Promise<Empresa[]> {
		try {
			let data: Empresa[] = [];
			const statment = query(
				collection(firestore, "empresas"),
				where("nome", "in", [nome]),
				orderBy("nome", "asc")
			);

			const querySnapshot = await getDocs(statment);
			if (querySnapshot) {
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
			}
			return data;
		} catch (error) {
			console.error("Error getting document: ", error);
			return [];
		}
	}

	return (
		<EmpresaContext.Provider value={{ save, del, empresas, getEmpresasByName }}>
			{children}
		</EmpresaContext.Provider>
	);
};
