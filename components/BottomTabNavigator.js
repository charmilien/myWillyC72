import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TransactionScreen from "../screens/Transaction";
import SearchScreen from "../screens/Search";
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

export default class BottomTabNavigator extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
        
        //  screenOptions= {()=>(tabBarIcon)}           
          //  tabBarIcon:()=>{ return()}        

          screenOptions={({route}) => ({

            tabBarIcon:({ focused,color,size})=>{
                
                        let iconName;
                        if(route.name==="Transaction"){
                            iconName="book" 
                            size=35
                        }else if(route.name==="Search"){
                            iconName="search"
                            size=35
                        }

                return(
                  <Ionicons name={iconName} size={size} color={color}/>
                )
            }
  })}

  // tabBarOptions={{}}
  tabBarOptions={{
    activeTintColor:"navy",
    inactiveTintColor:"grey",
    style:{ 
          height:100, borderTopWidth:5, borderTopColor:"#FFF",backgroundColor:"#F48D20"},
    labelStyle:{
               fontSize:20
               },
    labelPosition:"below-icon",
    tabStyle:{ 
              margin:10,borderWidth:4, borderRadius:25,borderColor:"black"
     
             }

  }}
        >
           <Tab.Screen name="Transaction" component={TransactionScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
