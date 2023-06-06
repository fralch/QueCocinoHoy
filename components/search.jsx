import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity, SafeAreaView,
    ScrollView, Image, Platform,
    ActivityIndicator, ImageBackground,
    Dimensions, Alert, Linking, StatusBar,
    TextInput, Button, Keyboard, Modal
} from 'react-native';
import {storeSesion, getSesion, removeSesion} from '../hooks/handleSession.js';
import { BlurView } from 'expo-blur';
import {getPlato} from '../utils/cocinando.js';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';


export default function Search() {
    const altura = Dimensions.get('window').height;
    const [modalPais, setModalPais] = useState(false);
    const [isKeyboardActive, setKeyboardActive] = useState(false);
    const [ingrediente, setIngrediente] = useState('');
    const [ingredientes, setIngredientes] = useState(['huevos', '2 papas', '3 zanahorias', '1 cebolla', '1 tomate', '1/2 taza de leche']);
    const [pais, setPais] = useState(null);

    const quitarIngrediente = (index) => {
        let ingredientesTemp = [...ingredientes];
        ingredientesTemp.splice(index, 1);
        setIngredientes(ingredientesTemp);
    }
    const agregarIngrediente = () => {
        if (ingrediente != '') {
            setIngredientes([...ingredientes, ingrediente]);
            setIngrediente('');
        }
    }

    const guardarPais = async () => {
        try {
            await storeSesion(pais);
        } catch (error) {
            console.log(error);
        }
    }
    
    const eliminarPais = async () => {
        try {
            await removeSesion('pais');
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerPlato = async () => {
        const ingredientes_pais = {
            ingredientes,
            pais
        };
        try {
            const plato = await getPlato(ingredientes_pais);
            let respuesta =  plato[0].message.content
            respuesta = respuesta.replace(/<br>/g, '\n');
            respuesta = JSON.parse(respuesta);
            console.log(respuesta);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getPais = async () => {
            try {
                const pais = await getSesion('pais');
                if (pais != null) {
                    setPais(pais);
                }
                if (pais == null) {
                    setModalPais(true);
                }
            } catch (error) {
                console.log(error);
            }
            console.log(pais);
            
        }
        getPais();
    
        
        
            
        
    }, []);

    

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardActive(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardActive(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            {
                isKeyboardActive ? null :
                    <TouchableOpacity style={{ flexDirection: "row", alignSelf: "flex-end" }} onPress={
                        () => {
                            if(pais != null){
                                eliminarPais();
                                setPais(null);
                                setModalPais(true);
                            }
                        }
                     }
                    >
                        <Text style={{ color: '#383838', fontWeight: "normal", fontSize: 13, marginRight: 20 }}>País: <Text style={{ fontWeight: "bold" }}> { pais}</Text></Text>
                    </TouchableOpacity>
            }

            <View style={{ marginTop: 50 }}>
                <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 50 }}>
                    <Image source={require('../assets/logo/logo_cocina.jpg')} style={{ width: 180, height: 120 }} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ color: '#383838' }}>
                        <Text style={{ color: '#F9CC00', fontWeight: "bold" }}>Cocina</Text> con lo que tienes en casa

                    </Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <TextInput
                        style={styles.input} placeholder="Ingresar ingredientes: ejem. 2 papas, huevos"
                        onChangeText={text => setIngrediente(text)} value={ingrediente}
                        //  onsubmitediting: cuando se presiona enter en el teclado del celular
                        onSubmitEditing={() => agregarIngrediente()}
                    />
                    <TouchableOpacity
                        style={{ backgroundColor: '#F9CC00', padding: 10, borderRadius: 10, height: 40, justifyContent: "center" }}
                        onPress={() => agregarIngrediente()}
                    >
                        <AntDesign name="caretright" size={24} color="#383838" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ height: altura*0.25}} showsVerticalScrollIndicator={false}>
                    {
                        isKeyboardActive ? null :
                            <View style={{
                                flexDirection: "row", justifyContent: "center", marginTop: 10,
                                flexWrap: "wrap", width: "75%", alignSelf: "center"
                            }}>

                                {ingredientes.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={{ backgroundColor: '#F9CC00', padding: 10, borderRadius: 10, height: 40, justifyContent: "center", margin: 5 }}
                                            onPress={() => quitarIngrediente(index)}
                                        >
                                            <Text style={{ color: '#383838' }}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                    }
                </ScrollView>


            </View>
            <View style={[{}]} >
                {
                    isKeyboardActive ? null :
                        <TouchableOpacity 
                            style={{ backgroundColor: '#383838', padding: 10, borderRadius: 10, height: 60, justifyContent: "center", width: "75%", alignSelf: "center", justifyContent: "center" }}
                            onPress={() => obtenerPlato()}
                        >
                            <MaterialCommunityIcons style={{ alignSelf: "center" }} name="chef-hat" size={30} color="#F9CC00" />
                            <Text style={{ color: '#F9CC00', textAlign: "center", fontWeight: "bold" }}>Cocinar</Text>
                        </TouchableOpacity>
                }
            </View>
            {
                isKeyboardActive ? null :
                    <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
                        <Text style={{ color: '#ddd', fontWeight: "normal", fontSize: 13, marginLeft: 20 }}>By Frank Cairampoma (@fralch)</Text>
                    </View>
            }
             <Modal
                animationType="slide"
                transparent={true}
                visible={modalPais}
            >
                 <BlurView intensity={90} tint="dark" style={styles.blurBackground}>
                    <View style={styles.modalViewResultado}>
                        <Text style={[styles.textoModal, { fontSize: 15, textAlign: "center",}]}>Escribe tu pais</Text>
                        
                        <TextInput
                            style={[styles.input, { width: "100%", marginTop: 20 }]} placeholder="Escribe tu pais"
                            onChangeText={text => {
                                if (text != '') {
                                    setPais(text);
                                }
                            }} value={pais}
                        />

                        <TouchableOpacity style={[{ backgroundColor: "#F9CC00", paddingVertical: 10, paddingHorizontal: 30 }]} onPress={() => { 
                            if(pais != ''){
                                guardarPais();
                                setModalPais(false);
                            }
                         }} >
                            <Text style={[styles.textoModal, { color: "white" }]}>Ok</Text>
                        </TouchableOpacity>


                    </View>

                </BlurView>
            </Modal>
        </View>
        
    );

};


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFEF9',
        justifyContent: 'space-around',
    },
    input: {
        height: 40,
        width: "75%",
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: '#bbb',
    },
    modalViewResultado: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width: "80%",
        height: "33%",
    },
    textoModal: {
        color: "#383838",
        fontWeight: "bold",
        textAlign: "center"
    },
    centeredView: {
      },
      blurBackground: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
});