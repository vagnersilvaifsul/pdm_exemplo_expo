/* eslint-disable react-hooks/exhaustive-deps */
import { firestore, storage } from "@/firebase/firebaseInit";
import { Usuario } from "@/model/Usuario";
import * as ImageManipulator from "expo-image-manipulator";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const UserContext = createContext({});

export const UserProvider = ({ children }: any) => {
	const { userAuth, delAccount } = useContext(AuthContext);
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

	async function update(usuario: Usuario, urlDevice: string): Promise<string> {
		try {
			if (urlDevice !== "") {
				const urlStorage = await sendImageToStorage(urlDevice);
				if (!urlStorage) {
					return "Erro ao atualizar o usuário. Contate o suporte."; //não deixa salvar ou atualizar se não realizar todos os passos para enviar a imagem para o storage
				}
				usuario.urlFoto = urlStorage;
			}
			await setDoc(doc(firestore, "usuarios", usuario.uid), {
				curso: usuario.curso,
				email: usuario.email,
				nome: usuario.nome,
				perfil: usuario.perfil,
				urlFoto: usuario.urlFoto,
			});
			setUserFirebase(usuario);
			return "ok";
		} catch (e) {
			console.error(e);
			return "Erro ao atualizar o usuário. Contate o suporte.";
		}
	}

	//Função utilitário para envio de imagens para o serviço de Storage
	//urlDevice: qual imagem que está no device que deve ser enviada via upload
	async function sendImageToStorage(urlDevice: string): Promise<string | null> {
		try {
			//1. Redimensiona, compacta a imagem, e a transforma em blob
			//ImageManipulator.ImageManipulator.manipulate será o substituto de ImageManipulator.manipulateAsync
			const imageRedimencionada = await ImageManipulator.manipulateAsync(
				urlDevice,
				[{ resize: { width: 150, height: 150 } }],
				{ compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
			);
			const data = await fetch(imageRedimencionada?.uri);
			const blob = await data.blob();

			//2. e prepara o path onde ela deve ser salva no storage
			const storageReference = ref(
				storage,
				`imagens/usuarios/${usuerFirebase?.uid}/foto.png`
			);

			//3. Envia para o storage
			await uploadBytes(storageReference, blob);

			//4. Retorna a URL da imagem
			const url = await getDownloadURL(
				ref(storage, `imagens/usuarios/${usuerFirebase?.uid}/foto.png`)
			);
			return url;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async function del(uid: string): Promise<string> {
		try {
			await deleteDoc(doc(firestore, "usuarios", uid));
			await delAccount(); //TODO: garantir que o login seja recente, menor que 5 minutos, segundo especificação do serviço Authentication
			return "ok";
		} catch (e) {
			console.error(e);
			return "Erro ao excluir a conta. Contate o suporte.";
		}
	}

	return (
		<UserContext.Provider value={{ usuerFirebase, update, del }}>
			{children}
		</UserContext.Provider>
	);
};
