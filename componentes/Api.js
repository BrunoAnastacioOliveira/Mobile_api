const API_URL = "https://apiestoque.webapptech.site/api/produtos";
import { Alert } from "react-native";

// Buscar Estoques
export const fetchEstoque = async (setRegistros) => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro ao buscar o Estoque");
    }

    const data = await response.json();
    console.log("Estoques recebidos da API:", data);

    setRegistros(data.data);
  } catch (error) {
    console.error("Erro ao buscar o Estoque:", error);
    throw error;
  }
};

// Criar Estoque
export const createEstoque = async (EstoqueData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(EstoqueData),
    });

    if (response.status === 204) {
      Alert.alert("Sucesso!", "Cadastro realizado com sucesso!");
      return {};
    }

    const textResponse = await response.text();
    console.log("Resposta bruta da API:", textResponse);

    let responseData;
    try {
      responseData = JSON.parse(textResponse);
    } catch (error) {
      console.warn("A resposta não é um JSON válido.");
      responseData = null;
    }

    if (!response.ok || !responseData) {
      throw new Error(responseData?.message || "Erro desconhecido na API");
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao cadastrar o Estoque:", error.message);
    Alert.alert("Erro ao cadastrar", `Detalhes: ${error.message}`);
    return null;
  }
};

// Deletar Estoque
export const deleteEstoque = async (EstoqueId, setRegistros) => {
  try {
    const response = await fetch(`${API_URL}/${EstoqueId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const responseData = await response.json();

      if (responseData.success) {
        Alert.alert("Sucesso!", responseData.message);

        setRegistros((prevRegistros) => {
          const novaLista = prevRegistros.filter(
            (Estoques) => Estoques.codigo !== EstoqueId
          );
          console.log("Nova lista de Estoques:", novaLista);
          return novaLista;
        });
      } else {
        Alert.alert("Erro", responseData.message);
      }
    } else {
      const textResponse = await response.text();
      let responseData = null;

      try {
        responseData = JSON.parse(textResponse);
      } catch (error) {
        console.warn("A resposta não é um JSON válido.");
      }

      throw new Error(
        responseData?.message || "Erro desconhecido ao excluir o Estoque"
      );
    }
  } catch (error) {
    console.error("Erro ao excluir Estoque:", error.message);
    Alert.alert("Erro ao excluir", `Detalhes: ${error.message}`);
  }
};

// Atualizar Estoque
export const updateEstoque = async (EstoqueId, updatedData, navigation) => {
  try {
    const response = await fetch(`${API_URL}/${EstoqueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    console.log("Dados enviados:", updatedData);

    if (response.status === 200) {
      Alert.alert("Sucesso!", "Estoque atualizado com sucesso!");
      navigation.navigate("Home");
    } else {
      const textResponse = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(textResponse);
      } catch (error) {
        console.warn("A resposta não é um JSON válido.");
        responseData = null;
      }

      throw new Error(
        responseData?.message || "Erro desconhecido ao atualizar o Estoque"
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar o Estoque:", error.message);
    Alert.alert("Erro ao atualizar", `Detalhes: ${error.message}`);
  }
};
