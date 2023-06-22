import { API_KEY } from '@env';
import axios from 'axios';


export const getPlato = async (ingredientes_pais) => {
    console.log('iniciando gpt-3');
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

    // const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //         Authorization: "Bearer " + API_KEY,
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         model: "gpt-3.5-turbo",
    //         messages: [
    //             {
    //                 role: "system",
    //                 content: 
    //                     `
    //                         El usuario quiere cocinar algo con ${ingredientes} (no necesariamente se usan todos estos ingredientes) y 
    //                         quiere cocinar una comida muy tipica de ${pais}, que no sea ningun tipo de tortilla a menos que el pais sea de mexico, puedes agregar algunos ingredientes,  ¿qué le recomiendas?, debes responder en español.
    //                         Y en formato de JSON como por ejemplo:
    //                         {
    //                             "ingredientes": "...",
    //                             "pais": "Colombia",
    //                             "respuesta": "Arroz con pollo",
    //                             "receta": "...",
    //                             "informacion_nutricional": "..."
    //                         }  
    //                         SOLO BRINDAR UNA RESPUESTA EN FORMATO JSON, SIN COMENTARIOS NI NADA. 
    //                     `
    //             },
    //             {
    //                 role: "user",
    //                 content: "..."
    //             }
    //         ]
    //     })
    // })
    // const data = await respuesta.json();
    // // console.log(data.choices)   ;
    // return data.choices;
    
    const requestData = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              El usuario quiere cocinar algo con ${ingredientes} (no necesariamente se usan todos estos ingredientes) y 
              quiere cocinar una comida muy típica de ${pais}, que no sea ningún tipo de tortilla a menos que el país sea de México, puedes agregar algunos ingredientes,  ¿qué le recomiendas?, debes responder en español.
              Y en formato de JSON como por ejemplo:
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
      };
      
      const config = {
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json"
        }
      };
      
      try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", requestData, config);
        const data = response.data;
        // console.log(data.choices);
        return data.choices;
      } catch (error) {
        console.error(error);
        // Manejar el error según corresponda
      }
    


}