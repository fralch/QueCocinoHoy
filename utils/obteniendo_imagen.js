import axios from 'axios';

export const Obteniendo_imagen = async (plato) => {

    //scraping imagen de google imagenes
    const scrapeGoogleImages = async (searchQuery) => {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch&tbs=isz:lt,islt:qsvga&hl=es-419&sa=X&ved=0CAIQpwVqFwoTCODlqJnir_8CFQAAAAAdAAAAABAD&biw=1443&bih=1024`;


        const imagenes = await axios.get(searchUrl);
        const imageUrls = extractImageUrls(imagenes.data);
        return imageUrls;
    }

    function extractImageUrls(html) {
        const regex = /<img[^>]+src="([^">]+)/g;
        const matches = html.matchAll(regex);
        const imageUrls = [];

        for (const match of matches) {
            const imageUrl = match[1];
            imageUrls.push(imageUrl);
        }

        return imageUrls;
    } 

    const data = await scrapeGoogleImages(plato);

    return data[3]; 

    
    
    

   



};