export async function buscarCep(cep: string): Promise<string | null> {
	try {
		const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
		if (!response.ok) {
			throw new Error("Erro na requisição");
		}
		const data = await response.json();
		if (data.erro) {
			throw new Error("CEP não encontrado");
		}
		return JSON.stringify(data);
	} catch (error) {
		console.error("Erro ao buscar CEP:", error);
		return null;
	}
}
