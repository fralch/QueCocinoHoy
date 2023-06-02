import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity, SafeAreaView,
    ScrollView, Image, Platform,
    ActivityIndicator, ImageBackground,
    Dimensions, Alert, Linking, StatusBar,
    TextInput, Button, Keyboard
} from 'react-native';
import { AntDesign, MaterialCommunityIcons  } from '@expo/vector-icons';

export default function Search() {
    const [isKeyboardActive, setKeyboardActive] = useState(false);
    const [ingrediente, setIngrediente] = useState('');
    const [ingredientes, setIngredientes] = useState(['huevos', '2 papas', '3 zanahorias', '1 cebolla', '1 tomate', '1/2 taza de leche']);

    const quitarIngrediente = (index) => {
        let ingredientesTemp = [...ingredientes];
        ingredientesTemp.splice(index, 1);
        setIngredientes(ingredientesTemp);
    }
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
           
            <View style={{  marginTop: 50 }}>
                <View style={{ flexDirection: "row", justifyContent: "center" , marginBottom:50}}>
                     <Image source={require('../assets/logo/logo_cocina.jpg')} style={{ width: 180, height: 120 }} />
                </View>
                    
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ color: '#383838' }}> 
                        <Text style={{ color: '#F9CC00', fontWeight: "bold" }}>Cocina</Text> con lo que tienes en casa
                        
                    </Text>
                </View>
                    
                <View style={{ flexDirection: "row", justifyContent: "center"}}>
                    <TextInput 
                        style={styles.input} placeholder="Ingresar ingredientes: ejem. 2 papas, huevos" 
                        onChangeText={text => setIngrediente(text)} value={ingrediente}
                        //  onsubmitediting: cuando se presiona enter en el teclado del celular
                        onSubmitEditing={() => { setIngredientes([...ingredientes, ingrediente]); setIngrediente('') }}
                    />
                    <TouchableOpacity 
                        style={{ backgroundColor: '#F9CC00', padding: 10, borderRadius: 10, height: 40, justifyContent: "center" }}
                        onPress={() => { setIngredientes([...ingredientes, ingrediente]); setIngrediente('') }}
                    >
                        <AntDesign name="caretright" size={24} color="#383838" />
                    </TouchableOpacity>
                </View>
                {
                    isKeyboardActive ? null :
                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10, 
                    flexWrap: "wrap", width: "75%", alignSelf: "center"}}>
    
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
               

            </View>
            <View style={[{  }]} >
                <TouchableOpacity style={{ backgroundColor: '#383838', padding: 10, borderRadius: 10, height: 60, justifyContent: "center", width: "75%", alignSelf: "center" , justifyContent: "center"}}>
                    <MaterialCommunityIcons style={{ alignSelf:"center"}} name="chef-hat" size={30} color="#F9CC00" />
                    <Text style={{ color: '#F9CC00', textAlign: "center",   fontWeight: "bold"}}>Cocinar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF9',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    input: {
        height: 40,
        width: "75%",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#bbb',
    }
});