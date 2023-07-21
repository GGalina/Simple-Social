import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { connect, useDispatch } from 'react-redux';
import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect, useRef } from 'react';
import { createPost } from '../Redux/Posts/postOperations';
import { selectEmail, selectUserName,selectAvatarURL } from '../Redux/Users/userSelectors';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const CreatePostsScreen = ({createPost, userId, avatarUrl, userName}) => {
    const [photoName, setPhotoName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    const cameraRef = useRef(null);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
   
    useEffect(() => {
        requestPermissions();
        return () => {
            clearFields();
        };
    }, []);

    useEffect(() => {
        if (isFocused) {
            requestPermissions();
            updateCurrentLocation();
        } else {
            clearFields();
        }
    }, [isFocused]);

    const updateCurrentLocation = async () => {
        if (hasCameraPermission) {
            const location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
        }
    };

    const requestPermissions = async () => {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

        setHasCameraPermission(cameraStatus === 'granted');
        if (locationStatus === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const { uri } = await cameraRef.current.takePictureAsync();
                await MediaLibrary.createAssetAsync(uri);
                setCapturedImage(uri);
            } catch (error) {
                alert('Error taking picture:', error);
            }
        };
    };

    const openCamera = async () => {
        if (hasCameraPermission) {
            setCapturedImage(null);
        } else {
            requestPermissions();
        }
    };

    const clearFields = () => {
        setCapturedImage(null);
        setCurrentLocation(null);
        setPhotoName('');
        setLocationName('');
    };

    const publishPost = async () => {
        const post = {
            photo: capturedImage,
            photoName: photoName,
            locationName: locationName,
            currentLocation: currentLocation,
            likes: 0,
            userId: userId,
            avatarUrl: avatarUrl,
            userName: userName,
        };

        await createPost(post);
        navigation.navigate('Home', {screen: 'Posts'});

        setCapturedImage(null);
        setCurrentLocation(null);
        setLocationName('');
        setPhotoName('');
    };

    return (
    <View style={styles.container}>
        <View style={styles.postImageContainer}>
            {(hasCameraPermission && capturedImage) ? (
                <TouchableOpacity onPress={openCamera}>
                    <Image source={{ uri: capturedImage }} style={styles.cameraImage} />
                    <View style={styles.cameraOverlay}>
                        <TouchableOpacity onPress={openCamera} style={styles.iconContainer}>
                            <MaterialIcons name="photo-camera" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ) : (
            (hasCameraPermission && !capturedImage) ? (
            <View style={styles.cameraContainer}>
                {isFocused && (
                    <Camera style={styles.camera} type={type} ref={cameraRef}>
                        <View style={styles.photoView}>
                            <TouchableOpacity
                                style={styles.flipContainer}
                                onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                                );
                                }}
                            >
                                <MaterialCommunityIcons
                                name="camera-flip-outline"
                                size={24}
                                color="rgba(189, 189, 189, 1)"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={takePicture} style={[styles.iconContainer, styles.buttonPhoto]}>
                                <MaterialIcons name="photo-camera" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                )}
            </View>
            ) : (
            <TouchableOpacity onPress={openCamera} style={styles.permissionContainer}>
                <View style={styles.permissionIconContainer}>
                    <MaterialIcons name="photo-camera" size={25} color="#BDBDBD" />
                </View>
            </TouchableOpacity>
            )
            )}
        </View>
        <Text style={styles.cameraDesc}>{capturedImage ? 'Редагувати фото' : 'Завантажте фото'}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    name="name"
                    value={photoName}
                    onChangeText={text => setPhotoName(text)}
                    placeholder="Назва..."
                    style={styles.input}
                    placeholderTextColor="#BDBDBD"
                />
            </View>
            <View style={styles.inputWrapperWithIcon}>
                <SimpleLineIcons name="location-pin" size={24} color="rgba(189, 189, 189, 1)" />
                <TextInput
                    name="location"
                    value={locationName}
                    onChangeText={text => setLocationName(text)}
                    placeholder="Місцевість..."
                    style={styles.input}
                    placeholderTextColor="#BDBDBD"
                />
            </View>
            <TouchableOpacity
                style={[
                capturedImage ? styles.postButtonEnabled : styles.postButtonDisabled,
                ]}
                onPress={publishPost}
                disabled={!capturedImage}
                >
                <Text style={[capturedImage ? styles.postTextActive : styles.postText]}>
                    Опубліковати
                </Text>
            </TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        paddingTop: 32,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 8,
    },
    postImageContainer: {
        width: '100%',
        height: 240,
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderStyle: 'solid',
    },
    cameraContainer: {
        width: '100%',
        height: 240,
        borderRadius: 8,
        overflow: 'hidden',
    },
    cameraImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    camera: {
        flex: 1,
    },
    photoView: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    flipContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    iconContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -30 }, { translateY: -30 }],
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 60,
        height: 60,
    },
    buttonPhoto: {
        alignSelf: 'center',
        alignItems: 'center',
    },
    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    permissionIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    permissionText: {
        color: '#BDBDBD',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
    inputWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        borderStyle: 'solid',
    },
    inputWrapperWithIcon: {
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 16,
    },
    input: {
        color: '#212121',
        width: '100%',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        height: 50,
    },
    cameraDesc: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color: '#BDBDBD',
    },
    postButtonDisabled: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
        backgroundColor: '#F6F6F6',
        borderRadius: 100,
        marginTop: 43,
        marginBottom: 16,
        width: '100%',
    },
    postButtonEnabled: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
        backgroundColor: '#FF6C00',
        borderRadius: 100,
        marginTop: 43,
        marginBottom: 16,
        width: '100%',
    },
    postText: {
        color: '#BDBDBD',
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        fontSize: 16,
    },
    postTextActive: {
        color: '#FFFFFF',
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        fontSize: 16,
    },
    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const mapDispatchToProps = (dispatch) => {
    return {
        createPost: (post) => dispatch(createPost(post))
    };
};
const mapStateToProps = (state) => ({
    userName: selectUserName(state),
    avatarUrl: selectAvatarURL(state),
    userId: selectEmail(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostsScreen);