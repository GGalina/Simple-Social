import store from './Redux/store';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import background from './assets/images/background.jpg';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import HomeScreen from './Screens/Home';
import MapScreen from './Screens/MapScreen';
import PostsScreen from './Screens/PostsScreen';
import LoginScreen from './Screens/LoginScreen';
import ProfileScreen from './Screens/ProfileScreen';
import CommentsScreen from './Screens/CommentsScreen';
import CreatePostsScreen from './Screens/CreatePostsScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import {
  View,
  Keyboard,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';

const MainStack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Black': require('./assets/fonts/Roboto/Roboto-Black.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
    'Roboto-Light': require('./assets/fonts/Roboto/Roboto-Light.ttf'),
    'Roboto-Medium': require('./assets/fonts/Roboto/Roboto-Medium.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
    'Roboto-Thin': require('./assets/fonts/Roboto/Roboto-Thin.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <Provider store={store}>
      <ImageBackground source={background} style={styles.background}>
        <NavigationContainer theme={navTheme}>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
              <MainStack.Navigator initialRouteName="Registration" screenOptions={{ headerShown: false }}>
                <MainStack.Screen name="Registration" component={RegistrationScreen} />
                <MainStack.Screen name="Login" component={LoginScreen} />
                <MainStack.Screen name="Home" component={HomeScreen} />
                <MainStack.Screen name="Posts" component={PostsScreen} />
                <MainStack.Screen name="Profile" component={ProfileScreen} />
                <MainStack.Screen
                  name="Comments"
                  component={CommentsScreen}
                  options={{
                    headerShown: true,
                    headerTitle: 'Коментарі',
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                      fontFamily: "Roboto-Medium",
                      fontWeight: 500,
                      fontSize: 17,
                      color: '#212121',
                      textAlign: "center",
                      lineHeight: 22,
                      letterSpacing: -0.408,
                    },
                  }}
                />
                <MainStack.Screen name="Map"
                  component={MapScreen}
                  options={{
                    headerShown: true,
                    headerTitle: 'Карта',
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                      fontFamily: "Roboto-Medium",
                      fontWeight: 500,
                      fontSize: 17,
                      color: '#212121',
                      textAlign: "center",
                      lineHeight: 22,
                      letterSpacing: -0.408,
                    },
                  }}
                />
                <MainStack.Screen name="CreatePostsScreen" component={CreatePostsScreen} />
              </MainStack.Navigator>
            </View>
          </TouchableWithoutFeedback>
        </NavigationContainer>
      </ImageBackground>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
});