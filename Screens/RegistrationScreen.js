import * as yup from 'yup';
import { connect } from 'react-redux';
import { useState, useEffect } from "react";
import { AntDesign } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import { registerUser } from '../Redux/Users/userOperations';
import {
    View,
    Text,
    Alert,
    Image,
    Keyboard,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native";

const RegistrationScreen = ({ navigation, registerUser }) => {
    const [isSelectedImage, setSelectedImage] = useState(null);
    const [isFocusedLogin, setIsFocusedLogin] = useState(false);
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isInputFilled, setIsInputFilled] = useState({
        login: false,
        email: false,
        password: false,
    });

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleImageUpload = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Потрібен доступ до фотографій у галереї!');
            return;
        }

        const imageResult = await ImagePicker.launchImageLibraryAsync();

        if (!imageResult.canceled) {
            const selectedAsset = imageResult.assets[0];
            setSelectedImage(selectedAsset.uri || selectedAsset.uri !== null ? selectedAsset.uri : null);
        }
    };

    const handleImageDelete = () => {
        setSelectedImage(null);
    };

    const handleFocus = (value) => {
        switch (value) {
            case "login":
                setIsFocusedLogin(true);
                break;
            case "email":
                setIsFocusedEmail(true);
                break;
            case "password":
                setIsFocusedPassword(true);
                break;
            default:
                return;
        }
    };

    const loginValidationSchema = yup.string()
        .required('Поле логіну не може бути порожнім');
    const emailValidationSchema = yup.string()
        .email('Невірний формат пошти')
        .required('Поле пошти не може бути порожнім');
    const passwordValidationSchema = yup.string()
        .min(8, 'Пароль має бути мінімум 8 символів')
        .required('Поле паролю не може бути порожнім');

    const handleBlur = (value) => {
        switch (value) {
            case 'login':
                setIsFocusedLogin(false);
                loginValidationSchema
                    .validate(login)
                        .then(() => {
                            setLoginError('');
                        })
                        .catch((error) => {
                            setLoginError(error.message);
                        });
                break;
            case 'email':
                setIsFocusedEmail(false);
                emailValidationSchema
                    .validate(email)
                        .then(() => {
                            setEmailError('');
                        })
                        .catch((error) => {
                            setEmailError(error.message);
                        });
                break;
            case 'password':
                setIsFocusedPassword(false);
                passwordValidationSchema
                    .validate(password)
                        .then(() => {
                            setPasswordError('');
                        })
                        .catch((error) => {
                            setPasswordError(error.message);
                        });
                break;
            default:
                return;
        }
    };

    const handleChangeText = (value, field) => {
        switch (field) {
            case 'login':
                setLogin(value);
                loginValidationSchema
                    .validate(value)
                        .then(() => {
                            setLoginError('');
                            setIsInputFilled((prevState) => ({ ...prevState, login: !!value }));
                        })
                        .catch((error) => {
                            setLoginError(error.message);
                            setIsInputFilled((prevState) => ({ ...prevState, login: false }));
                        });
                break;
            case 'email':
                setEmail(value);
                emailValidationSchema
                    .validate(value)
                        .then(() => {
                            setEmailError('');
                            setIsInputFilled((prevState) => ({ ...prevState, email: !!value }));
                        })
                        .catch((error) => {
                            setEmailError(error.message);
                            setIsInputFilled((prevState) => ({ ...prevState, email: false }));
                        });
                break;
            case 'password':
                setPassword(value);
                passwordValidationSchema
                    .validate(value)
                        .then(() => {
                            setPasswordError('');
                            setIsInputFilled((prevState) => ({ ...prevState, password: !!value }));
                        })
                        .catch((error) => {
                            setPasswordError(error.message);
                            setIsInputFilled((prevState) => ({ ...prevState, password: false }));
                        });
                break;
            default:
                return;
        }
    };

    const handleSubmit = () => {
        yup.object().shape({
            login: loginValidationSchema,
            email: emailValidationSchema,
            password: passwordValidationSchema
        }).validate({ login, email, password }, { abortEarly: false })
            .then(async () => {
                const userData = { login, email, password, avatar: isSelectedImage };

                await registerUser(userData);
                navigation.navigate('Home')

                setSelectedImage(null);
                setLogin('');
                setEmail('');
                setPassword('');
                setLoginError('');
                setEmailError('');
                setPasswordError('');
            })
            .catch((error) => {
                if (error.inner && error.inner.length > 0) {
                    setLoginError('');
                    setEmailError('');
                    setPasswordError('');

                    error.inner.forEach((validationError) => {
                        if (validationError.path === 'login') {
                            setLoginError(validationError.message);
                        } else if (validationError.path === 'email') {
                            setEmailError(validationError.message);
                        } else if (validationError.path === 'password') {
                            setPasswordError(validationError.message);
                        }
                    });
                }
                if (error.message === 'UserAlreadyExists') {
                    Alert.alert('Ой!', 'Здається, ця електронна адреса вже зареєстрована у нас. Будь ласка, увійдіть');
                    navigation.navigate('Login');

                    setSelectedImage(null);
                    setLogin('');
                    setEmail('');
                    setPassword('');
                    setLoginError('');
                    setEmailError('');
                    setPasswordError('');
                }
            });
    };

    useEffect(() => {
        const keyboardShownListener = Keyboard.addListener("keyboardDidShow",
            () => {
                setIsKeyboardShown(true);
            }
        );
        const keyboardHideListener = Keyboard.addListener("keyboardDidHide",
            () => {
                setIsKeyboardShown(false);
            }
        );
        return () => {
            keyboardShownListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };
    
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={[styles.container, isKeyboardShown && styles.containerKeyboard]}>
                <View style={styles.imageContainer}>
                    {!isSelectedImage && (
                        <View>
                            <View style={styles.image} />
                            <TouchableOpacity onPress={handleImageUpload} style={styles.buttonPhoto}>
                                <AntDesign name="pluscircleo" size={25} style={styles.buttonText} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {isSelectedImage && (
                        <View>
                            <Image source={{ uri: isSelectedImage }} style={styles.image} />
                            <TouchableOpacity onPress={handleImageDelete} style={styles.buttonPhotoSelected}>
                                <AntDesign name="closecircleo" size={25} style={styles.buttonTextSelected} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <Text style={styles.header}>Реєстрація</Text>
                <View style={styles.formInput}>
                    <View style={[ loginError ? styles.inputContainerWithoutMargin : styles.inputContainer]}>
                        <TextInput
                            name="login"
                            value={login}
                            onChangeText={(value) => handleChangeText(value, 'login')}
                            onFocus={() => handleFocus("login")}
                            onBlur={() => handleBlur("login")}
                            style={[
                                styles.input,
                                isFocusedLogin && styles.inputFocused,
                                isInputFilled.login && styles.inputFilled,
                            ]}
                            placeholder="Логін"
                        />
                        {loginError !== '' && <Text style={styles.errorText}>{loginError}</Text>}
                    </View>
                    <View style={[emailError ? styles.inputContainerWithoutMargin : styles.inputContainer]}>
                        <TextInput
                            name="email"
                            value={email}
                            onChangeText={(value) => handleChangeText(value, 'email')}
                            onFocus={() => handleFocus("email")}
                            onBlur={() => handleBlur("email")}
                            style={[
                                styles.input,
                                isFocusedEmail && styles.inputFocused,
                                isInputFilled.email && styles.inputFilled,
                            ]}
                            placeholder="Адреса електронної пошти"
                        />
                        {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
                    </View>
                    <View style={[ passwordError ? styles.inputContainerWithoutMargin : styles.inputContainer]}>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                name="password"
                                value={password}
                                onChangeText={(value) => handleChangeText(value, 'password')}
                                onFocus={() => handleFocus("password")}
                                onBlur={() => handleBlur("password")}
                                style={[
                                    styles.input,
                                    isFocusedPassword && styles.inputFocused,
                                    isInputFilled.password && styles.inputFilled,
                                ]}
                                secureTextEntry={!isPasswordVisible}
                                placeholder="Пароль"
                            />
                            <TouchableOpacity
                                style={styles.paswordShownButton}
                                onPress={togglePasswordVisibility}
                            >
                                <Text style={styles.passwordShownText}>
                                    {isPasswordVisible ? "Приховати" : "Показати"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}
                    </View>
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.registerButton}>
                    <Text style={styles.registerText}>Зареєструватися</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alreadyRegisteredLink} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.alreadyRegisteredText}>Вже є акаунт? Увійти</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        marginTop: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        border: "1px solid #FFFFFF",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    containerKeyboard: {
        marginTop: Platform.OS === "ios" ? 125 : 70,
        paddingTop: Platform.OS === "ios" ? 0 : 50,
    },
    imageContainer: {
        borderRadius: 16,
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: "#F6F6F6",
        borderStyle: "solid",
        backgroundColor: "#F6F6F6",
        position: "absolute",
        top: -60,
    },
    buttonPhoto: {
        position: "absolute",
        bottom: 10,
        right: -15,
        width: 25,
        height: 25,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonPhotoSelected: {
        position: "absolute",
        bottom: 10,
        right: -15,
        width: 25,
        height: 25,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FF6C00"
    },
    buttonTextSelected: {
        color: "#BDBDBD"
    },
    image: {
        borderRadius: 16,
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: "#F6F6F6",
    },
    header: {
        fontFamily: "Roboto-Medium",
        fontSize: 30,
        textAlign: "center",
        fontWeight: 500,
        letterSpacing: 0.3,
        color: "#212121",
        marginTop: 92,
        marginBottom: 33,
    },
    formInput: {
        width: "100%",
    },
    inputContainer: {
        position: "relative",
        paddingBottom: 16, 
    },
    inputContainerWitouthMargin: {
        paddingBottom: 0,
    },
    input: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        backgroundColor: "#F6F6F6",
        color: "#BDBDBD",
        width: "100%",
        height: 50,
        paddingLeft: 16,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderStyle: "solid",
        borderRadius: 5,
    },
    inputFocused: {
        color: "#212121",
        borderColor: "#FF6C00",
        backgroundColor: "#FFFFFF",
    },
    passwordWrapper: {
        position: "relative",
    },
    paswordShownButton: {
        position: "absolute",
        right: 16,
        top: 16,
    },
    passwordShownText: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        color: "#1B4371",
    },
    inputFilled: {
        color: "#212121",
    },
    errorText: {
        fontFamily: "Roboto-Regular",
        fontSize: 12,
        paddingLeft: 16,
        color: "red",
        marginTop: 2,    
    },
    registerButton: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
        backgroundColor: "#FF6C00",
        borderRadius: 100,
        marginTop: 43,
        marginBottom: 16,
        width: "100%",
    },
    registerText: {
        color: "#FFFFFF",
        fontFamily: "Roboto-Regular",
        textAlign: "center",
        fontSize: 16,
    },
    alreadyRegisteredText: {
        color: "#1B4371",
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        marginBottom: 45,
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        registerUser: (userData) => dispatch(registerUser(userData))
    };
};

export default connect(null, mapDispatchToProps)(RegistrationScreen);