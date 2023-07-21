import { connect } from 'react-redux';
import React, { useState } from "react";
import { selectPostsForLastWeek } from '../Redux/Posts/postSelectors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign, SimpleLineIcons, EvilIcons } from '@expo/vector-icons';
import { fetchAllPosts, updateLikesCount } from '../Redux/Posts/postOperations';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity, 
} from "react-native";

const PostsScreen = ({ fetchAllPosts, posts, updateLikesCount }) => {
    const [isLiked, setIsLiked] = useState(false);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            fetchAllPosts();
        }, [])
    );

    const handleNavigationToMap = ({ latitude, longitude, locationName }) => () => {
        navigation.navigate("Map", { latitude, longitude, locationName });
    };

    const handleNavigationToComments = ({ postId, avatarUrl, userId, photo }) => () => {
        navigation.navigate("Comments", { postId, avatarUrl, userId, photo });
    };

    // const handleLikesToggle = ({ postId, oldLikes }) => {
    //     const likes = isLiked ? oldLikes - 1 : oldLikes + 1;
    //     updateLikesCount(postId, likes);
    //     setIsLiked(!isLiked);
    // };

    const renderItem = ({ item }) => (
        <View onStartShouldSetResponder={()=> true}>
            <View style={styles.containerUser}>
                {item.avatarUrl && (
                <Image source={{ uri: item.avatarUrl }} style={styles.image} />
                )}
                {!item.avatarUrl && (
                <View style={styles.imageContainer}>
                    <AntDesign name="user" size={25} color="#212121" />
                </View>
                )}
                <View style={styles.textContainer}>
                <Text style={styles.login}>{item.userName}</Text>
                <Text style={styles.email}>{item.email}</Text>
                </View>
            </View>
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
                        <TouchableOpacity style={styles.iconWrapper}
                            // onPress={() =>
                            //     handleLikesToggle({
                            //         postId: item.id, 
                            //         oldLikes: item.likes,
                            //     })()
                            // }
                            >
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
        <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.containerFlatList}
        />  
    );
};


const styles = StyleSheet.create({
    containerFlatList: {
        backgroundColor: "#FFFFFF",
        paddingTop: 32,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        flexGrow: 1,
    },
    containerUser: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 8,
        alignItems: "center",
        paddingBottom: 16,
    },
    imageContainer: {
        borderRadius: 16,
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: "#F6F6F6",
        borderStyle: "solid",
        backgroundColor: "#F6F6F6",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    image: {
        borderRadius: 16,
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: "#F6F6F6",
    },
    login: {
        fontFamily: "Roboto-Regular",
        fontSize: 13,
        fontWeight: 700,
    },
    email: {
        fontFamily: "Roboto-Regular",
        fontSize: 11,
        fontWeight: 400,
        color: "rgba(33, 33, 33, 0.80)",
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
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllPosts: () => dispatch(fetchAllPosts()),
        updateLikesCount: (postId, likes) => dispatch(updateLikesCount({postId, likes})),
    };
};

const mapStateToProps = (state) => ({
    posts: selectPostsForLastWeek(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsScreen);