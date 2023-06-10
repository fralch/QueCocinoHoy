import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity, SafeAreaView,
    ScrollView, Image, Platform,
    ActivityIndicator, ImageBackground,
    Dimensions, Alert, Linking, StatusBar,
    TextInput, Button, Keyboard, Modal
} from 'react-native';

import {Obteniendo_imagen} from '../utils/obteniendo_imagen.js';
import {storeSesion, getSesion, removeSesion} from '../hooks/handleSession.js';
import { BlurView } from 'expo-blur';
import {getPlato} from '../utils/cocinando.js';
import { AntDesign, MaterialCommunityIcons, Entypo, FontAwesome   } from '@expo/vector-icons';

//mostrar receta
export default function Receta (route ){
    const {receta} = route.route.params;
    // console.log(typeof receta);


    const altura = Dimensions.get('window').height;
    const [imagen, setImagen] = useState(null);
    useEffect(() => {
        //obteniendo imagen 
          const obtener_imagen = async () => {
            const imagen = await Obteniendo_imagen(receta.respuesta);
            setImagen(imagen);
          }
          
          obtener_imagen();
    }, []);

      

    return (
        <View style={[styles.container, {flexDirection: 'column'}]}>
            <View style={{ flex: 2, flexDirection: 'row', alignItems: "center" }} >
                <ImageBackground source={{uri : imagen}} 
                    style={{ flex: 1, resizeMode: "cover", justifyContent: "center", height: altura*0.45 }} 
                    blurRadius={0.8}
                >
                    <BlurView tint="dark" intensity={50} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "white", fontSize: 25, fontWeight: "bold", alignSelf:"center"}}>{receta.respuesta}</Text>
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
                <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 10 }} showsVerticalScrollIndicator={false}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 , padding:5}}>
                        <Entypo name="bowl" size={28} color="#F9CC00" style={{ marginRight:5}} />
                        Ingredientes
                    </Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>
                        {receta.ingredientes}

                    </Text>

                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 10 , padding:5}}>
                        <MaterialCommunityIcons name="chef-hat" size={27} color="#F9CC00" />
                        Preparación
                    </Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>{receta.receta}</Text>
                   

                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 10 ,padding:5 }}>
                        <MaterialCommunityIcons name="label-percent" size={28} color="#F9CC00" />
                        Información nutricional
                    </Text>
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>{receta.informacion_nutricional}</Text>

                    
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