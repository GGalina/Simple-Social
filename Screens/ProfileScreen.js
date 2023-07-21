import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../Redux/Users/userOperations';
import { fetchPosts } from '../Redux/Posts/postOperations';
import { selectPosts } from '../Redux/Posts/postSelectors';
import { AntDesign, SimpleLineIcons, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { selectUserName, selectAvatarURL, selectEmail } from '../Redux/Users/userSelectors';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const ProfileScreen = ({ fetchPosts, userName, avatarUrl, userId, posts, logoutUser }) => {
    const navigation = useNavigation();
    
    useEffect(() => {
        async function getData() {
            await fetchPosts(userId);
        }
        getData();
    }, [userId]);
    
    const handleNavigationToComments = ({postId, avatarUrl, userId, photo}) => () => {
        navigation.navigate("Comments", { postId, avatarUrl, userId, photo })
    }

    const handleNavigationToMap = ({ latitude, longitude, locationName }) => () => {
        navigation.navigate("Map", { latitude, longitude, locationName });
    };
    
    const handleLogoutUser = async () => { 
        await logoutUser();
        navigation.navigate('Login');
    };

    const renderItem = ({ item }) => (
        <View onStartShouldSetResponder={()=> true}>
            <Image source={{ uri: item.photo }} style={styles.postImage} />
            <Text style={styles.photoName}>{item.photoName}</Text>
            <View style={styles.postDesc}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.iconWrapper}
                        onPress={() =>
                            handleNavigationToComments({
                                postId: item.id,
                                avatarUrl: item.avatarUrl,
                                photo: item.photo,
                                userId: item.email,
                            })()
                        }
                        >
                        <EvilIcons name="comment" size={26} color="rgba(189, 189, 189, 1)" />
                            <Text style={styles.iconCount}>{item.commentCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconWrapper}>
                        <AntDesign name="like2" size={24} color="rgba(189, 189, 189, 1)" />
                        <Text style={styles.iconCount}>{item.likes}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                        <TouchableOpacity
                        style={styles.locationWrapper}
                        onPress={() =>
                            handleNavigationToMap({
                            latitude: item.currentLocation.coords.latitude,
                            longitude: item.currentLocation.coords.longitude,
                            locationName: item.locationName,
                            })()
                        }
                        >
                        <SimpleLineIcons name="location-pin" size={24} color="rgba(189, 189, 189, 1)" /> 
                            <Text style={styles.locationName}>{item.locationName}</Text>
                    </TouchableOpacity>    
                </View> 
            </View>  
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {avatarUrl && (
                    <View>
                        <Image source={{ uri: avatarUrl }} style={styles.imageWrapper} />
                        <TouchableOpacity style={styles.buttonPhotoSelected}>
                            <AntDesign name="closecircleo" size={25} style={styles.buttonTextSelected} />
                        </TouchableOpacity>
                    </View>
                )}
                {!avatarUrl && (
                    <View >
                        <AntDesign name="user" size={35} color="#212121" style={styles.imageContainer}/>
                        <TouchableOpacity style={styles.buttonPhoto}>
                            <AntDesign name="pluscircleo" size={25} style={styles.buttonText} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
                <Text style={styles.username}>{userName}</Text>
                <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.containerFlatList}
                /> 
            <TouchableOpacity style={styles.logoutContainer} onPress={handleLogoutUser}>
                <MaterialIcons name="logout" size={24} style={styles.logoutIcon}/>
            </TouchableOpacity>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
        position: "relative",
        marginTop: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        border: "1px solid #FFFFFF",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flex: 1,
  },
  profileContainer: {
        borderRadius: 16,
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: "#F6F6F6",
        borderStyle: "solid",
        backgroundColor: "#F6F6F6",
        position: "absolute",
        top: -60,
        left: 148,
    },
    imageContainer: {
        borderRadius: 16,
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: "#F6F6F6",
        paddingTop: 42,
        paddingLeft: 42,
    },
    imageWrapper: {
        borderRadius: 16,
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: "#F6F6F6",
    },
    username: {
        fontFamily: "Roboto-Regular",
        textAlign: "center",
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: 0.3,
        color: "#212121",
        paddingTop: 92,
        paddingBottom: 32,
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
    logoutContainer: {
        marginRight: 16,
        position: "absolute",
        right: 16,
        top: 32,
    },
    logoutIcon: {
        color: "#BDBDBD"
    },
    containerFlatList: {
        backgroundColor: "#FFFFFF",
        paddingTop: 32,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        flexGrow: 1,
        minHeight: 340,
    },
    postImage: {
        width: "100%",
        height: 240,
        borderRadius: 8,
    },
    photoName: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        fontWeight: 500,
        paddingBottom: 8,
        paddingTop: 8,
        color: "#212121"
    },
    iconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    iconWrapper: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 6,
    },
    locationWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    iconCount: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        color: "#BDBDBD",
    },
    locationName: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        fontWeight: 400,
        color: "#212121",
        textDecorationLine: "underline",
    },
    postDesc: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        paddingBottom: 34,
    },
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPosts: (userId) => dispatch(fetchPosts(userId)),
        logoutUser: () => dispatch(logoutUser()),
    };
};

const mapStateToProps = (state) => ({
    userName: selectUserName(state),
    avatarUrl: selectAvatarURL(state),
    userId: selectEmail(state),
    posts: selectPosts(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
