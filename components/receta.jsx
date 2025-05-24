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
import {getPlato} from '../utils/recocinando.js';
import {storeSesion, getSesion, removeSesion} from '../hooks/handleSession.js';
import { BlurView } from 'expo-blur';
import {getPlatoagain} from '../utils/recocinando.js';
import { AntDesign, MaterialCommunityIcons, Entypo, FontAwesome, Foundation    } from '@expo/vector-icons';

//mostrar receta
export default function Receta (route){
    const {receta} = route.route.params;
    const [loading, setLoading] = useState(false);
    const altura = Dimensions.get('window').height;
    const [imagen, setImagen] = useState(null);
    const [receta_, setReceta] = useState(receta);
    useEffect(() => {

        //obteniendo imagen 
          const obtener_imagen = async () => {
            const imagen = await Obteniendo_imagen(receta_.respuesta);
            setImagen(imagen);
          }
          
          obtener_imagen();
    }, [receta_]);

    const recocinar = async () => {
        setLoading(true);
        const ingrediente_plato ={
            ingrediente: String(receta.ingredientes), 
            receta: receta.respuesta,
            pais: receta.pais,
        }


        const plato = await getPlatoagain(ingrediente_plato);
        let respuesta =  plato[0].message.content
            respuesta = respuesta.replace(/<br>/g, '\n');
            respuesta = JSON.parse(respuesta);
            setLoading(false);
            setReceta(respuesta);
    }

    return (
        loading ? 
        <View style={[styles.container, { backgroundColor: receta.theme === 'dark' ? '#1a1a1a' : '#F9CC00' }]}>
            <Image source={require('../assets/osito_cocinando.gif')}   
                style={styles.loadingImage}
                resizeMode="contain" 
            />
            <ActivityIndicator size="large" color={receta.theme === 'dark' ? '#F9CC00' : 'white'} />
        </View> 
        :
        <View style={[styles.container, {flexDirection: 'column'}]}>
            <View style={styles.imageContainer} >
                <ImageBackground source={{uri : imagen}} 
                    style={styles.backgroundImage} 
                    blurRadius={0.8}
                >
                    <BlurView tint={receta.theme === 'dark' ? 'dark' : 'light'} intensity={50} style={styles.blurContainer}>
                        <Text style={styles.titleText}>{receta_.respuesta}</Text>
                    </BlurView>
                </ImageBackground>
            </View>
            <View style={[styles.contentContainer, {
                backgroundColor: receta.theme === 'dark' ? '#2d2d2d' : '#eee'
            }]} >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.sectionTitle, {
                        color: receta.theme === 'dark' ? '#fff' : '#000'
                    }]}>
                        <Entypo name="bowl" size={28} color="#F9CC00" style={styles.icon} />
                        Ingredientes
                    </Text>
                    <Text style={[styles.sectionContent, {
                        color: receta.theme === 'dark' ? '#e0e0e0' : '#000'
                    }]}>
                        {receta_.ingredientes}
                    </Text>

                    <Text style={[styles.sectionTitle, {
                        color: receta.theme === 'dark' ? '#fff' : '#000'
                    }]}>
                        <MaterialCommunityIcons name="chef-hat" size={27} color="#F9CC00" />
                        Preparación
                    </Text>
                    <Text style={[styles.sectionContent, {
                        color: receta.theme === 'dark' ? '#e0e0e0' : '#000'
                    }]}>
                        {receta_.receta}
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingImage: {
        width: 120,
        height: 120,
        marginBottom: 50
    },
    imageContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        height: Dimensions.get('window').height * 0.45
    },
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    contentContainer: {
        flex: 3,
        flexDirection: 'column',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 10,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flex: 1,
        flexDirection: 'column',
        padding: 10
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 5
    },
    sectionContent: {
        fontSize: 15,
        marginBottom: 10
    },
    icon: {
        marginRight: 5
    }
});