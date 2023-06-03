import { API_KEY } from '@env';

export const getPlato = async (ingredientes_pais) => {
    const ingredientes = ingredientes_pais.ingredientes; 
    const pais = ingredientes_pais.pais;

    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: 
                        `
                            El usuario quiere cocinar algo con ${ingredientes} y 
                            es de ${pais}, ¿qué le recomiendas?, debes responder en español.
                            Y en formato de JSON.stringify como por ejemplo:
                            {
                                "ingredientes": "pollo, arroz, tomate",
                                "pais": "Colombia",
                                "respuesta": "Arroz con pollo",
                                "receta": "..."
                            }   
                        `
                },
                {
                    role: "user",
                    content: "..."
                }
            ]
        })
    })
    const data = await respuesta.json();
    console.log(data.choices)   ;
    return data.choices;

}