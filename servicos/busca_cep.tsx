export async function buscarCep(cep: string): Promise<string | null> {
	try {
		const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
		if (!response.ok) {
			throw new Error("Erro na requisição");
		}
		const data = await response.json();
		if (data.erro) {
			return null;
		}
		return JSON.stringify(data);
	} catch (error) {
		return null;
	}
}
