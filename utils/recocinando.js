import { API_KEY } from '@env';
import axios from 'axios';

export const getPlatoagain = async (ingredientes_pais) => {
    console.log('iniciando gpt-3 again');
    
    const ingredientes = ingredientes_pais.ingrediente; 
    const pais = ingredientes_pais.pais;
    const receta = ingredientes_pais.receta;

 



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