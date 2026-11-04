export async function buscarCep(cep: string): Promise<string | null> {
	try {
		const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
		if (!response.ok) {
			console.error("Erro ao buscar o CEP:", response);
			return null;
		}
		const data = await response.json();
		if (data.erro) {
			return null;
		}
		return JSON.stringify(data);
	} catch (error) {
		console.error("Erro ao buscar o CEP:", error);
		return null;
	}
}
