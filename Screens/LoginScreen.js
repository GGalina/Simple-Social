import * as yup from 'yup';
import { connect } from 'react-redux';
import { useState, useEffect } from "react";
import { loginUser } from '../Redux/Users/userOperations';
import {
    View,
    Text,
    Alert,
    TextInput,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    StyleSheet
} from "react-native";


const LoginScreen = ({ navigation, loginUser }) => {
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isInputFilled, setIsInputFilled] = useState({
        email: false,
        password: false,
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleFocus = (value) => {
        switch (value) {
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

    const emailValidationSchema = yup.string()
        .required('Пошта або пароль не вірний');
    const passwordValidationSchema = yup.string()
        .required('Пошта або пароль не вірний');

    const handleBlur = (value) => {
        switch (value) {
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
            email: emailValidationSchema,
            password: passwordValidationSchema
        }).validate({ email, password }, { abortEarly: false })
            .then(async () => {
                const userData = { email, password };

                await loginUser(userData);
                navigation.navigate('Home');

                setEmail('');
                setPassword('');
                setEmailError('');
                setPasswordError('');
            })
            .catch((error) => {
                if (error.inner && error.inner.length > 0) {
                    setEmailError('');
                    setPasswordError('');

                    error.inner.forEach((validationError) => {
                        if (validationError.path === 'email') {
                            setEmailError(validationError.message);
                        } else if (validationError.path === 'password') {
                            setPasswordError(validationError.message);
                        }
                    });
                }
                if (error.message === 'UserNotFound') {
                    Alert.alert('Ой!', 'Здається, у Вас немає облікового запису в нас. Будь ласка, зареєструйтеся');
                    navigation.navigate('Registration');

                    setEmail('');
                    setPassword('');
                    setEmailError('');
                    setPasswordError('');
                }
                if (error.message === 'WrongCredantials') {
                    Alert.alert('Ой!', 'Пошта або пароль не вірні');
                    navigation.navigate('Login');

                    setEmail('');
                    setPassword('');
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
                <Text style={styles.header}>Увійти</Text>
                <View style={styles.formInput}>
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
                            {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}
                    </View>
                </View>      
                    <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
                        <Text style={styles.loginText}>Увійти</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.notRegisteredLink} onPress={() => navigation.navigate("Registration")}>
                        <Text style={styles.notRegisteredText}>Немає акаунту? Зареєструватися</Text>
                    </TouchableOpacity>
                </View>
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
        marginTop: Platform.OS === "ios" ? 125 : 230,
        paddingTop: Platform.OS === "ios" ? 0 : 30,
    },
    header: {
        fontFamily: "Roboto-Medium",
        fontSize: 30,
        textAlign: "center",
        fontWeight: 500,
        letterSpacing: 0.3,
        color: "#212121",
        marginTop: 32,
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
    loginButton: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
        backgroundColor: "#FF6C00",
        borderRadius: 100,
        marginTop: 43,
        marginBottom: 16,
    },
    loginText: {
        color: "#FFFFFF",
        fontFamily: "Roboto-Regular",
        textAlign: "center",
        fontSize: 16,
    },
    notRegisteredText: {
        color: "#1B4371",
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        marginBottom: 45,
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (userData) => dispatch(loginUser(userData))
    };
};

export default connect(null, mapDispatchToProps)(LoginScreen);