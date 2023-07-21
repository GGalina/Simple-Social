import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Feather } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';

const Stack = createStackNavigator();

const MapScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { latitude, longitude, locationName } = route.params;

    useEffect(() => {
        const handleGoBack = () => {
        navigation.goBack();
        };

        navigation.setOptions({
        headerLeft: () => (
            <TouchableOpacity style={styles.arrowContainer} onPress={handleGoBack}>
            <Feather name="arrow-left" size={24} color="rgba(33, 33, 33, 0.8)" />
            </TouchableOpacity>
        ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                mapType="standard"
                minZoomLevel={15}
            >
                <Marker
                    title={locationName}
                    coordinate={{ latitude: latitude, longitude: longitude }}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    header: {
        paddingTop: 56,  
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        height: 122,
        width: Dimensions.get("window").width,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    arrowContainer: {
        position: "absolute",
        left: 16,
        bottom: 16,
    },
    headerText: {
        color: "#212121",
        fontFamily: "Roboto-Medium",
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.408,
        marginTop: 30,
    }
});

export default connect(null, null)(MapScreen);
