import axios from 'axios';

export const Obteniendo_imagen = async () => {

    let lista_imagenes = [];
    //scraping imagen de google imagenes
    function scrapeGoogleImages(searchQuery) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch&tbs=isz:lt,islt:qsvga&hl=es-419&sa=X&ved=0CAIQpwVqFwoTCODlqJnir_8CFQAAAAAdAAAAABAD&biw=1443&bih=1024`;


         axios.get(searchUrl)
            .then((response) => {
                const imageUrls = extractImageUrls(response.data);
                // console.log('URLs de imágenes encontradas:');
                console.log(imageUrls);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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

   
        const searchQuery = 'lomo saltado';
        await scrapeGoogleImages(searchQuery);

};