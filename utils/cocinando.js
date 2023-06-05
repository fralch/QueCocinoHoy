import { API_KEY } from '@env';

export const getPlato = async (ingredientes_pais) => {
    const array_ingredientes = ingredientes_pais.ingredientes; 
    const pais = ingredientes_pais.pais;

    let ingredientes = "";
    for (let i = 0; i < array_ingredientes.length; i++) {
        if (i === array_ingredientes.length - 1) {
            ingredientes += array_ingredientes[i];
        } else {
            ingredientes += array_ingredientes[i] + ", ";
        }
    }
    
    // console.log(ingredientes);

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
                                "tus_ingredientes": "pollo, arroz, tomate",
                                "ingredientes_extra": "sal, pimienta",
                                "pais": "Colombia",
                                "respuesta": "Arroz con pollo",
                                "receta": "..."
                            }   
                            SOLO BRINDAR UNA RESPUESTA EN FORMATO JSON.stringify, SIN COMENTARIOS NI NADA.
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
    // return data.choices;

}