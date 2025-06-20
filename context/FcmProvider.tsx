import { firestore } from "@/firebase/firebaseInit";
import * as Notifications from "expo-notifications";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { createContext } from "react";

export const FcmContext = createContext({});

export const FcmProvider = ({ children }: any) => {
	async function cadastrarTokenDispositivoNoFirestore() {
		try {
			const token = await Notifications.getDevicePushTokenAsync();
			//Primeiro verifica se o token já existe no Firestore
			const q = query(
				collection(firestore, "tokens_fcm"),
				where("token", "==", token.data)
			);
			const querySnapshot = await getDocs(q);
			//Se não existir, insere o token
			if (querySnapshot.empty) {
				await addDoc(collection(firestore, "tokens_fcm"), {
					token: token.data,
				}); //insert
			}
		} catch (error: any) {
			console.error(
				"Erro buscar o token do dispositivo no Firestore: " + error.message
			);
		}
	}
	return (
		<FcmContext.Provider value={{ cadastrarTokenDispositivoNoFirestore }}>
			{children}
		</FcmContext.Provider>
	);
};
