import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, 
         TextInput,Image,ImageBackground, Alert,KeyboardAvoidingView,ToastAndroid } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from '../config'
import firebase from 'firebase'

const bgImg=require('../assets/background2.png')
const appIcon=require('../assets/appIcon.png')
const appName=require('../assets/appName.png')

console.log(db)
export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      scannedData: "",
      bookId:"", studentId:"", bookName:'', studentName:''
    };
  }

  getCameraPermissions = async domState => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false
    });
  };

  handleBarCodeScanned = async ({ data }) => {
    const {domState}=this.state
 if(domState==="bookId"){
    this.setState({
      bookId: data,
      domState: "normal",
      scanned: true
    });
  }else if(domState==="studentId"){
    this.setState({
      studentId: data,
      domState: "normal",
      scanned: true
    });
  }

  };

  handleTransaction =async()=>{
    alert("HII transaction started")
    const{bookId,studentId}=this.state
   
    // fetching book name and storing in bookName status
    await db.collection("books").doc(bookId).get().then(doc=>{
          var book=doc.data()
            this.setState({bookName:book.name})  
         
    })
  
     // fetching student name and storing in studentName status
    await db.collection("students").doc(studentId).get().then(doc=>{
      var student= doc.data()
        this.setState({studentName:student.name})    
    })


      db.collection("books").doc(bookId).get().then((doc)=>{
        var book=doc.data()

        if(book.isBookAvailable){
          this.issueBook()
        }else{
          this.returnBook()
        }
    })
  }

  issueBook = async()=>{
    const {studentName,studentId, bookName, bookId}=this.state;

    alert("book Issued to student")
   //ToastAndroid.show("book Issued to student",ToastAndroid.SHORT)

    // create Transaction as collection in db
    db.collection("transactions").add({
      'Student_Name':studentName,
      'Student_Id':studentId,
      'Book_Name':bookName,
      'Book_Id':bookId,
       date: firebase.firestore.Timestamp.now().toDate(),
      'Transaction_Type': "Issue"
    })

    //change book availablility as false in db
    db.collection("books").doc(bookId).update({isBookAvailable : false})

    //change Number of book issue to student 
    db.collection("students").doc(studentId).update({numberOfBookIssued : firebase.firestore.FieldValue.increment(1)})

    //updating local status
    this.setState({bookId:'', studentId:''})
  }


  returnBook=async()=>{
    const {bookId,studentId,bookName,studentName}=this.state;

    alert("book returned to Library")
    //ToastAndroid.show("book returned to Library",ToastAndroid.SHORT)

    // create Transaction as collection in db
    db.collection("transactions").add({
      'Student_Name':studentName,
      'Student_Id':studentId,
      'Book_Name':bookName, 
      'Book_Id':bookId,
       date: firebase.firestore.Timestamp.now().toDate(),
      'Transaction_Type': "Return"
    })

    //change book availablility as true in db
    db.collection("books").doc(bookId).update({isBookAvailable : true})

    //change Number of book issue to student 
    db.collection("students").doc(studentId).update({numberOfBookIssued :firebase.firestore.FieldValue.increment(-1)})

    //updating local status
    this.setState({bookId:'', studentId:''})
  }



  render() {
    const { bookId,studentId,domState, scanned } = this.state;

    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    return (
     
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
         
         <ImageBackground 
         source={bgImg} 
         style={styles.bgImage}>
              <View style={styles.upperContainer}>
              <Image source={appIcon} style={styles.appIcon}/>
              <Image source={appName} style={styles.appName}/>
              </View>


        <View style={styles.subContainer}>

            <View style={styles.textInputContainer}>
                    <TextInput 
                    style={styles.textInput} 
                    placeholder={"Enter Book Id"} placeholderTextColor={"#FFF"}
                    onChangeText={(text)=>{ this.setState({bookId:text.trim()})}}
                    value={bookId}
                    />    
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.getCameraPermissions("bookId")}>
                    <Text style={styles.buttonText}>Scan</Text>
                    </TouchableOpacity>
            </View>

              <View style={[styles.textInputContainer,{marginTop:25}]}>
                    <TextInput 
                    style={styles.textInput} 
                    placeholder={"Enter Student Id"} placeholderTextColor={"#FFF"}
                    value={studentId}
                    onChangeText={(text)=>{this.setState({studentId:text.trim()})}}
                    />
                    <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.getCameraPermissions("studentId")}>
                    <Text style={styles.buttonText}>Scan</Text>
                    </TouchableOpacity>
              </View>

              <TouchableOpacity 
              style={styles.submitButton}
              onPress={this.handleTransaction}
              >
                 <Text style={styles.text}> SUBMIT </Text>
              </TouchableOpacity>
        </View>
        
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5653D4"
  },
  text: {
    color: "#ffff",
    fontSize: 15
  },
  button: {
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderTopRightRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF"
  },

  subContainer:{
    flex:0.5, 
    alignItems:'center',
    marginTop:65
  },
 
  textInputContainer:{
    borderWidth:2,
    borderRadius:10,
    flexDirection:"row", 
    borderColor:"#fff"
  },
  
    textInput:{
      width:"68%",
      height:50,
      padding:10,
      borderRadius:10,
      borderWidth:3,
      backgroundColor:"#5653D4",
      color:"#FFF",
      fontSize:18
    },

bgImage:{
  flex:1,
  resizeMode:"cover",
  justifyContent:"center"
},
upperContainer:{
  flex:0.5,
  justifyContent:"center",
  alignItems:"center"
},
appIcon:{
  width:180,
  height:180,
  resizeMode:"contain",
  marginTop:80
},
appName:{
  width:80,
  height:80,
  resizeMode:"contain"
},

submitButton :{
  width: 100,
  height: 40,
  justifyContent: "center",
  alignItems: "center",borderWidth:4,borderColor:"#F48D20",
  borderRadius: 20,marginTop:25,backgroundColor:"green"}

});
