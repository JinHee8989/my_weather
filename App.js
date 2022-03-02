import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimention, Text, View, ScrollView, Dimensions,ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';


const {width:SCREEN_WIDTH} = Dimensions.get("window"); //앱화면 크기
const API_KEY = "0014e209b1560831661429fadfe9fc0f";


export default function App() {
  const [city,setCity] = useState("Loading......");
  const [days, setDays] = useState([]);
  const [location,setLocation] = useState(); 
  const [ok,setOk] = useState(true);
  const ask = async() => {
    const {granted} =  await Location.requestForegroundPermissionsAsync();
    if(!granted){
        setOk(false);
    }

    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync();
    const location = await Location.reverseGeocodeAsync(
      {latitude,longitude},{useGoogleMaps:false}
    );

    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);

  }
  useEffect(()=>{ask();},[])

  return (
  <View style = {styles.container}>
    <View style = {styles.city}>
      <Text style = {styles.cityName}>{city}</Text>
    </View>
    <ScrollView pagingEnabled showsHorizontalScrollIndicator={false} horizontal contentContainerStyle = {styles.wheather}>
      {days.length === 0 ? (
      <View style = {styles.day}>
        <ActivityIndicator color="white" style={{marginTop:10}}/>
      </View>) : (
        days.map((day,index) => 
        <View key={index} style = {styles.day}>
          <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
          <Text style={styles.desc}>{day.wheather[0].main}</Text>
          <Text style={styles.tinyText}>{day.wheather[0].description}</Text>
        </View>
        )
      )}
    </ScrollView>
    
  </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "pink",
  },
  city : {
    flex:1.2,
    justifyContent: 'center',
    alignItems:"center"

  },
  wheather :{

  },
  cityName:{
    fontSize:65,
    fontWeight:"600"
  },
  day : {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems:'center',
  },
  temp : {
    marginTop:50,
    fontSize:170
  },
  desc : {
    fontSize:60

  },
  tinyText : {
    fontSize:20
  }
})


