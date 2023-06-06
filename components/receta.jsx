import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity, SafeAreaView,
    ScrollView, Image, Platform,
    ActivityIndicator, ImageBackground,
    Dimensions, Alert, Linking, StatusBar,
    TextInput, Button, Keyboard, Modal
} from 'react-native';
import axios from 'axios';
import {storeSesion, getSesion, removeSesion} from '../hooks/handleSession.js';
import { BlurView } from 'expo-blur';
import {getPlato} from '../utils/cocinando.js';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

//mostrar receta
export default function Receta (){
    const altura = Dimensions.get('window').height;
    const [loading, setLoading] = useState(true);   
    const [plato, setPlato] = useState("ceviche");
    const [imagen, setImagen] = useState("");

    //scraping imagen de google imagenes
    function scrapeGoogleImages(searchQuery) {
        const searchUrl = `https://www.google.com/search?q=gatitos&tbm=isch&tbs=isz:l&hl=es-419&sa=X&ved=0CAIQpwVqFwoTCODlqJnir_8CFQAAAAAdAAAAABAD&biw=1443&bih=1024`;
      
        return axios.get(searchUrl)
          .then((response) => {
            const imageUrls = extractImageUrls(response.data);
            const largerImageUrls = getLargerImageUrls(imageUrls);
            console.log('URLs de imágenes encontradas:');
            console.log(largerImageUrls);
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
      
      function getLargerImageUrls(imageUrls) {
        const largerImageUrls = [];
      
        for (const imageUrl of imageUrls) {
          const largerImageUrl = imageUrl.replace(/(https?:\/\/[^\/]+\/[^\/]+\/)([^\/]+)/, '$1s0/$2');
          largerImageUrls.push(largerImageUrl);
        }
      
        return largerImageUrls;
      }
      useEffect(() => {
        const searchQuery = 'gatos lindos';
        scrapeGoogleImages(searchQuery);
      }, []);
    


    return (
        <View style={[styles.container, {flexDirection: 'column'}]}>
            <View style={{ flex: 2, flexDirection: 'row', alignItems: "center" }} >
                <ImageBackground source={{uri :"https://portal.andina.pe/EDPfotografia3/Thumbnail/2018/06/26/000514068W.jpg"}} 
                    style={{ flex: 1, resizeMode: "cover", justifyContent: "center", height: altura*0.45 }} >
                    <BlurView tint="dark" intensity={50} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>Receta</Text>
                    </BlurView>
                </ImageBackground>
            </View>
            <View style={{ flex: 3, 
                flexDirection: 'column',
                backgroundColor: "#eee",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                padding: 10,
                paddingTop: 20,
                paddingBottom: 20,
                justifyContent: "center",
                alignItems: "center"

             }} >
                <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 10 }} >
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Ingredientes</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>1/2 taza de mantequilla</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>1/2 taza de azúcar</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>1/2 taza de azúcar morena</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>1 huevo</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>1 cucharadita de vainilla</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>1 1/2 tazas de harina</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>1/2 cucharadita de bicarbonato de sodio</Text>

                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 10 }}>Preparación</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>1. Precalienta el horno a 180 °C.</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>2. En un tazón, bate la mantequilla con el azúcar y el azúcar morena hasta que estén cremosos.</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>3. Agrega el huevo y la vainilla y bate hasta integrar.</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>4. Agrega la harina y el bicarbonato y mezcla hasta integrar.</Text>

                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 10 }}>Información nutricional</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>Calorías: 120 kcal</Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>Carbohidratos: 15 g</Text>

                    
                </ScrollView>
            </View>

        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }, 
   
});        