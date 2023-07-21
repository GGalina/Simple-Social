import React from 'react';
import { connect } from 'react-redux';
import PostsScreen from "./PostsScreen";
import ProfileScreen from "./ProfileScreen";
import CreatePostsScreen  from "./CreatePostsScreen";
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../Redux/Users/userOperations';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import { AntDesign, MaterialIcons, Ionicons, Feather  } from "@expo/vector-icons";

const Tabs = createBottomTabNavigator();

const HomeScreen = ({logoutUser}) => {
    const navigation = useNavigation();

    const handleGetBack = () => {
        navigation.navigate('Home', { screen: 'Posts' });
    };

    const handleLogout = async() => { 
        await logoutUser();
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Tabs.Navigator
            initialRouteName="Posts"
            screenOptions={{
                tabBarStyle: styles.tabContainer
            }}
            >
                <Tabs.Screen name="Posts"
                    component={PostsScreen}
                    options={{
                        title: "Публікації",
                        headerTitleAlign: "center",
                        tabBarShowLabel: false,
                        headerTitleStyle: {
                            color: "#212121",
                            textAlign: "center",
                            fontFamily: "Roboto-Medium",
                            fontSize: 17,
                            lineHeight: 22,
                            letterSpacing: -0.408,
                            paddingTop: 11,
                            paddingBottom: 11,
                        },
                        headerRight: () => (
                            <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
                                <MaterialIcons name="logout" size={24} style={styles.logoutIcon}/>
                            </TouchableOpacity>
                        ),
                        tabBarIcon: ({ focused, color, size }) => {
                            const navigation = useNavigation();
                            const routeName = navigation.getState().routes[navigation.getState().index].name;
                                if (routeName === 'CreatePostsScreen') {
                                    return null;
                                }
                                return <Ionicons name="md-grid-outline" size={24} styles={styles.footerIcon} />
                            }
                    }}
                />
                <Tabs.Screen name="CreatePostsScreen" component={CreatePostsScreen}
                    options={{
                        title: "Створити публікацію",
                        headerTitleAlign: "center",
                        tabBarShowLabel: false,
                        headerTitleStyle: {
                            color: "#212121",
                            textAlign: "center",
                            fontFamily: "Roboto-Medium",
                            fontSize: 17,
                            lineHeight: 22,
                            letterSpacing: -0.408,
                        },
                        headerLeft: () => (
                            <TouchableOpacity style={styles.arrowContainer}  onPress={handleGetBack}>
                                <Feather name="arrow-left" size={24} color="rgba(33, 33, 33, 0.8)" />
                            </TouchableOpacity>
                        ),
                        tabBarIcon: ({ focused, color, size }) => {
                            if (focused) {
                                return (
                                    <TouchableOpacity style={styles.plusContainerFocused} >
                                        <AntDesign name="delete" size={size} color="rgba(189, 189, 189, 1)" />
                                    </TouchableOpacity>
                                );
                            }
                            return (
                                <View style={styles.plusContainer}>
                                        <AntDesign name="plus" size={size} style={styles.plusIcon} />
                                </View>
                            )
                        },
                    }}
                />
                <Tabs.Screen name="ProfileScreen" component={ProfileScreen}
                    options={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, color, size }) => {
                            const navigation = useNavigation();
                            const routeName = navigation.getState().routes[navigation.getState().index].name;
                                if (routeName === 'CreatePostsScreen') {
                                    return null;
                                }
                                return <Feather name="user" size={24} style={styles.footerIcon} />
                            }
                    }}
        
                />
            </Tabs.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        paddingBottom: 22,
        paddingLeft: 75,
        paddingRight: 75,
        paddingTop: 9,
        height: 83,
        flexDirection: "row",
        justifyContent: "space-around",

    },
    plusContainerFocused: {
        width: 70,
        height: 40,
        backgroundColor: "rgba(246, 246, 246, 1)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Platform.OS === "ios" ? "50%" : 125,
    },
    plusContainer: {
        width: 70,
        height: 40,
        backgroundColor: "#FF6C00",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Platform.OS === "ios" ? "50%" : 125,
        },
    logoutContainer: {
        marginRight: 16,
    },
    arrowContainer: {
        marginLeft: 16,
    },
    logoutIcon: {
        color: "#BDBDBD"
    },
    footerIcon: {
        color: "rgba(33, 33, 33, 0.8)"
    },
    plusIcon: {
        color: "#FFFFFF"
    }
});

export default connect(null, { logoutUser})(HomeScreen);
