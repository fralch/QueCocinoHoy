import { API_KEY } from '@env';

export const getPlatoagain = async (ingredientes_pais) => {
    console.log('iniciando gpt-3 again');
    
    const ingredientes = ingredientes_pais.ingrediente; 
    const pais = ingredientes_pais.pais;
    const receta = ingredientes_pais.receta;

 



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
                        `   Al usuario tu ya le sugeriste cocinar ${receta} y el usuario te dice que no le gusta esa receta,
                            el usuario quiere volver cocinar algo con ${ingredientes} (no necesariamente se usan todos estos ingredientes) y 
                            quiere cocinar una comida muy tipica de ${pais}, que no sea ningun tipo de tortilla a menos 
                            que el pais sea de mexico, puedes agregar algunos ingredientes,  ¿qué le recomiendas?, 
                            debes responder en español. Y en formato de JSON como por ejemplo:
                            {
                                "ingredientes": "...",
                                "pais": "Colombia",
                                "respuesta": "Arroz con pollo",
                                "receta": "...",
                                "informacion_nutricional": "..."
                            }  
                            SOLO BRINDAR UNA RESPUESTA EN FORMATO JSON, SIN COMENTARIOS NI NADA. 
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
    // console.log(data.choices)   ;
    return data.choices;

}