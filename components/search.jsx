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
import { useNavigation } from '@react-navigation/native';

import { BlurView } from 'expo-blur';
import {getPlato} from '../utils/cocinando.js';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function Search() {
    const navigation = useNavigation();
    const altura = Dimensions.get('window').height;
    const [loading, setLoading] = useState(false);
    const [modalPais, setModalPais] = useState(false);
    const [isKeyboardActive, setKeyboardActive] = useState(false);
    const [ingrediente, setIngrediente] = useState('');
    const [ingredientes, setIngredientes] = useState(['huevos', '2 papas', '3 zanahorias', '1 cebolla', '1 tomate']);
    const [pais, setPais] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Cargar el tema guardado al iniciar
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await getSesion('theme');
                if (savedTheme !== null) {
                    setIsDarkTheme(savedTheme === 'dark');
                }
            } catch (error) {
                console.log('Error loading theme:', error);
            }
        };
        loadTheme();
    }, []);

    // Guardar el tema cuando cambie
    const toggleTheme = async () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        try {
            await storeSesion(newTheme ? 'dark' : 'light', 'theme');
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    // Obtener los estilos dinámicos basados en el tema
    const getThemeStyles = () => {
        return {
            container: {
                backgroundColor: isDarkTheme ? '#1a1a1a' : '#FFFEF9',
            },
            text: {
                color: isDarkTheme ? '#ffffff' : '#383838',
            },
            textSecondary: {
                color: isDarkTheme ? '#cccccc' : '#383838',
            },
            textMuted: {
                color: isDarkTheme ? '#888888' : '#ddd',
            },
            input: {
                backgroundColor: isDarkTheme ? '#2a2a2a' : '#ffffff',
                borderColor: isDarkTheme ? '#444444' : '#bbb',
                color: isDarkTheme ? '#ffffff' : '#383838',
            },
            modal: {
                backgroundColor: isDarkTheme ? '#2a2a2a' : 'white',
            },
            loadingContainer: {
                backgroundColor: isDarkTheme ? '#333333' : '#F9CC00',
            }
        };
    };

    const themeStyles = getThemeStyles();

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
            await storeSesion(pais, 'pais');
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
        setLoading(true);
        const ingredientes_pais = {
            ingredientes,
            pais
        };
        try {
            fetch('http://162.248.55.24:3000/gpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingredientes_pais)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let respuesta =  data[0].message.content
                respuesta = respuesta.replace(/<br>/g, '\n');
                respuesta = JSON.parse(respuesta);
                setLoading(false);
                navigation.navigate('Receta', {receta: respuesta});
            })
            .catch(err => console.log(err));
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
        loading ? 
        <View style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, themeStyles.loadingContainer]}>
            <Image source={require('../assets/osito_cocinando2.gif')}   
                style={{ width: 120, height: 120, marginBottom: 50 }}
                resizeMode="contain" 
            />
            <ActivityIndicator size="large" color="white" />
        </View> 
        :
        <View style={[styles.container, themeStyles.container]}>
            <StatusBar 
                barStyle={isDarkTheme ? 'light-content' : 'dark-content'} 
                backgroundColor={isDarkTheme ? '#1a1a1a' : '#FFFEF9'}
            />
            
            {/* Header con país y toggle de tema */}
            {
                isKeyboardActive ? null :
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                    <TouchableOpacity 
                        style={{ flexDirection: "row" }} 
                        onPress={() => {
                            if(pais != null){
                                eliminarPais();
                                setPais(null);
                                setModalPais(true);
                            }
                        }}
                    >
                        <Text style={[{ fontWeight: "normal", fontSize: 13 }, themeStyles.textSecondary]}>
                            Tema: <Text style={{ fontWeight: "bold" }}> {isDarkTheme ? "Oscuro" : "Claro"}</Text>
                        </Text>
                    </TouchableOpacity>
                    
                    {/* Toggle de tema */}
                    <TouchableOpacity 
                        style={styles.themeToggle} 
                        onPress={toggleTheme}
                    >
                        <Ionicons 
                            name={isDarkTheme ? "sunny" : "moon"} 
                            size={24} 
                            color={isDarkTheme ? "#F9CC00" : "#383838"} 
                        />
                    </TouchableOpacity>
                </View>
            }

            <View style={{ marginTop: 50 }}>
                <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 50 }}>
                    <Image source={require('../assets/logo/logo_cocina.png')} style={{ width: 180, height: 120 }} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={themeStyles.textSecondary}>
                        <Text style={{ color: '#F9CC00', fontWeight: "bold" }}>Cocina</Text> con lo que tienes en casa
                    </Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <TextInput
                        style={[styles.input, themeStyles.input]} 
                        placeholder="Ingresar ingredientes: ejem. 2 papas, huevos"
                        placeholderTextColor={isDarkTheme ? '#888888' : '#999999'}
                        onChangeText={text => setIngrediente(text)} 
                        value={ingrediente}
                        onSubmitEditing={() => agregarIngrediente()}
                    />
                    <TouchableOpacity
                        style={{ backgroundColor: '#F9CC00', padding: 10, borderRadius: 10, height: 40, justifyContent: "center" }}
                        onPress={() => agregarIngrediente()}
                    >
                        <AntDesign name="caretright" size={24} color="#383838" />
                    </TouchableOpacity>
                </View>
                
                <Text style={[{ fontWeight: "bold", fontSize: 15, marginLeft: 50, marginTop: 20 }, themeStyles.text]}>
                    Ingredientes:
                </Text>
                
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
                            onPress={() => {
                                // Datos de ejemplo para demostración
                                const recetaEjemplo = {
                                    ingredientes: ingredientes.join(", "),
                                    pais: pais || "Perú",
                                    respuesta: "Lomo Saltado",
                                    receta: "1. Cortar la carne en tiras finas.\n2. Cortar las cebollas y tomates en tiras.\n3. Freír las papas en aceite caliente hasta que estén doradas.\n4. En un wok o sartén grande, calentar aceite a fuego alto.\n5. Saltear la carne hasta que esté dorada.\n6. Agregar las cebollas y tomates, saltear por 2 minutos.\n7. Agregar salsa de soya, vinagre y condimentos.\n8. Mezclar bien y servir sobre las papas fritas con arroz blanco.",
                                    informacion_nutricional: "Calorías: 450 kcal\nProteínas: 30g\nCarbohidratos: 40g\nGrasas: 20g\nFibra: 5g",
                                    theme:  isDarkTheme ? "dark" : "light"
                                };
                                
                                navigation.navigate('Receta', {receta: recetaEjemplo});
                            }}
                        >
                            <MaterialCommunityIcons style={{ alignSelf: "center" }} name="chef-hat" size={30} color="#F9CC00" />
                            <Text style={{ color: '#F9CC00', textAlign: "center", fontWeight: "bold" }}>Cocinar</Text>
                        </TouchableOpacity>
                }
            </View>

            {
                isKeyboardActive ? null :
                    <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
                        <Text style={[{ fontWeight: "normal", fontSize: 13, marginLeft: 20 }, themeStyles.textMuted]}>
                            By Frank Cairampoma (@fralch)
                        </Text>
                    </View>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPais}
            >
                <BlurView intensity={90} tint={isDarkTheme ? "dark" : "light"} style={styles.blurBackground}>
                    <View style={[styles.modalViewResultado, themeStyles.modal]}>
                        <Text style={[styles.textoModal, { fontSize: 15, textAlign: "center" }, themeStyles.text]}>
                            Escribe tu país
                        </Text>
                        
                        <TextInput
                            style={[styles.input, { width: "100%", marginTop: 20 }, themeStyles.input]} 
                            placeholder="Escribe tu país"
                            placeholderTextColor={isDarkTheme ? '#888888' : '#999999'}
                            onChangeText={text => {
                                if (text != '') {
                                    setPais(text);
                                }
                            }} 
                            value={pais}
                        />

                        <TouchableOpacity 
                            style={[{ backgroundColor: "#F9CC00", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10, marginTop: 20 }]} 
                            onPress={() => { 
                                if(pais != ''){
                                    guardarPais();
                                    setModalPais(false);
                                }
                            }} 
                        >
                            <Text style={[styles.textoModal, { color: "#383838" }]}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
    },
    input: {
        height: 40,
        width: "75%",
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    modalViewResultado: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        width: "80%",
        height: "33%",
    },
    textoModal: {
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
    themeToggle: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(145, 145, 145, 0.1)',
    }
});