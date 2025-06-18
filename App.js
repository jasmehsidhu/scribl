import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView ,View,ScrollView,TouchableOpacity,TextInput} from 'react-native';
import {useState,useEffect} from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
var [notes,setnotes]=useState([])
async function signup(){
  const result=await axios.post('http://10.0.0.65:1000/add',{username:user,password:pass})
  if(result.data=='inserted'){
    showalert(true)
  }
  else{
    await AsyncStorage.setItem('username',user)
    var response=await axios.post('http://10.0.0.65:1000/show',{username:user.trim()})
    showmain(true)
    showsign(false)
  }
}
async function logout(){
  await AsyncStorage.clear()
  showmain(false)
  showsign(true)
  showalert(false)
}
useEffect(()=>{
async function sessionCheck(){
var item= await AsyncStorage.getItem('username')
if(item!=null){
  var results= await axios.post('http://10.0.0.65:1000/show',{username:item})
  setnotes(results.data)
  showmain(true)
  showsign(false)
}

}
sessionCheck()
},[])
async function newnote(){
  var item= await AsyncStorage.getItem('username')
 try{
  await axios.post('http://10.0.0.65:1000/note',{username:item.trim(),title:title.trim(),discription:dis.trim()})
  var response=await axios.post('http://10.0.0.65:1000/show',{username:item.trim()})
  setnotes(response.data)
  showmain(true)
  setaddnote(false)
  }
  catch(err){
    console.log(err)
  }
}
async function verify(){
     var response= await axios.post('http://10.0.0.65:1000/',{username:user,password:pass})
    try{
      setnotes(response.data)
      showmain(true)
      showlogin(false)
      await AsyncStorage.setItem('username',user)
    }
    catch(err){
      console.log(err)
    }
  } 
  function exchange(){
    setaddnote(true)
    showmain(false)
  }
function loginshift(){
  showlogin(true)
  showsign(false)
}
function signshift(){
  showlogin(false)
  showsign(true)
}
  var [main,showmain] = useState(false)
  var [dis,setdis]=useState();
  var [title,settitle]=useState();
  var [user,setUser]=useState()
  var [pass,setPass]=useState()
  var [login,showlogin]=useState(false)
  var [addnote,setaddnote]=useState(false)
  var [sign,showsign]=useState(true)
  var [alert,showalert]=useState(false)

  return (
    <SafeAreaView style={styles.container}>
{main? <><View style={styles.header}>
<Text style={styles.heading}>Notes</Text>
</View>
<View style={styles.main}>
 <ScrollView style={styles.scroll}>
  {notes.map((ele,ind)=>{
    return(
      <View style={styles.note}>
    <Text style={styles.notetitle}>{ele.note_tile}</Text>
      <Text style={styles.notedis}>{ele.note_discription}</Text>
  </View>
    )
  })}
 </ScrollView>
 <TouchableOpacity onPress={logout} style={styles.logout}><Text style={styles.logtxt}>LOG OUT</Text></TouchableOpacity>

 <TouchableOpacity onPress={exchange} style={styles.add}><Text style={styles.addbtn}>+</Text></TouchableOpacity>
</View></> : null}
{login? <><View>
<View style={styles.login}>
<Text style={styles.logint}>Login</Text>
<TextInput onChangeText={setUser} placeholder='Username' style={styles.username}></TextInput>
<TextInput onChangeText={setPass} placeholder='Password' style={styles.pass}></TextInput>
<Text style={styles.againbtn}>Need an account? <Text onPress={signshift} style={styles.spsign}>Sign up</Text></Text>
<TouchableOpacity onPress={verify} style={styles.loginbtn}><Text style={styles.logintext}>Login</Text></TouchableOpacity>
</View>
</View></> : null}
{sign? <><View>
<View style={styles.login}>
<Text style={styles.logint}>Sign Up</Text>
{alert?<><View style={styles.alert}><Text style={styles.alertt}>Username already exists</Text></View>
</>:null}<TextInput onChangeText={setUser} placeholder='Username' style={styles.username}></TextInput>
<TextInput onChangeText={setPass} placeholder='Password' style={styles.pass}></TextInput>
<Text style={styles.againbtn}>Already have an account? <Text onPress={loginshift} style={styles.spsign}>Login</Text></Text>
<TouchableOpacity onPress={signup} style={styles.loginbtn}><Text style={styles.logintext}>Sign up</Text></TouchableOpacity>
</View>
</View></> : null}
{addnote ? <>  <View>
<Text style={styles.listptitle}>Add a note</Text>
<TextInput onChangeText={settitle} style={styles.titlein} placeholder='Enter the title'></TextInput>
<TextInput onChangeText={setdis} style={styles.titlein} placeholder='Enter the discription'></TextInput> 
<TouchableOpacity onPress={newnote} style={styles.listingbtn}><Text style={styles.listingtext}>Add note</Text></TouchableOpacity>
</View></> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listptitle:{
    fontSize:30,
    marginTop:20,
    marginLeft:30,
    fontWeight:'bold'
      },
      imagebtn:{
        marginLeft:35,
        marginTop:30,
        backgroundColor:'#f2f2f2',
        height:30,
        width:100,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
          },
          titlein:{
            width:300,
            height:50,
            marginTop:30,
            marginLeft:30,
            backgroundColor:'#f2f2f2',
            paddingLeft:20,
            borderRadius:20
              },
  alert:{
      height:30,
      width:280,
      backgroundColor:'lightpink',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      marginTop:10,
      borderWidth:1.5,
      borderColor:'red',
  },
  againbtn:{
    marginTop:15
  },
  spsign:{
    color:'dodgerblue'
  },
  logintext:{
     color:'white'
  },
  loginbtn:{
     height:40,
     width:120,
     backgroundColor:'gold',
     display:'flex',
     alignItems:'center',
     justifyContent:'center',
     marginTop:20,
     borderRadius:10
  },
  username:{
     height:50,
     width:300,
     backgroundColor:'#f2f2f2',
     paddingLeft:10,
     marginTop:60,
     borderRadius:10
  },
  pass:{
    height:50,
    width:300,
    backgroundColor:'#f2f2f2',
    paddingLeft:10,
    marginTop:20,
    borderRadius:10
  },
  logint:{
    fontSize:30,
    marginTop:30
  },
  listingbtn:{
    marginLeft:35,
    marginTop:30,
    backgroundColor:'gold',
    height:40,
    width:100,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5
      },
  login:{
    padding:30,
    height:500,
    width:350,
    marginLeft:20,
    marginTop:100,
    borderRadius:20,
    display:'flex',
    alignItems:'center'

  },
  listingtext:{
    color:'white'
    },
  notetitle:{
    fontSize:25,
    fontWeight:'bold'
  },
  date:{
    fontSize:15
  },
  logtxt:{
    color:'white',
    fontSize:20,
    color:'gold'
  },
  logout:{
    position:'absolute',
    top:630,
    left:250,
height:40,
backgroundColor:'#f2f2f2',
width:120,
borderRadius:'8%',
display:'flex',
alignItems:'center',
justifyContent:'center'
  },
  main:{
    marginTop:10,
    display:'flex',
    alignItems:'center'
  },
  note:{
    height:170,
    width:350,
    backgroundColor:'#f2f2f2',
    borderRadius:12,
    display:'flex',
    padding:20,
    gap:30,
    marginTop:40
  },
  addbtn:{
    color:'white',
    fontSize:40,
   },
  header:{
   backgroundColor:'gold',
   height:85,
   paddingLeft:30,
   display:'flex',
   justifyContent:'center'
  },
  add:{
    position:'absolute',
    top:450,
    left:270,
height:70,
width:70,
borderRadius:'50%',
backgroundColor:'gold',
display:'flex',
alignItems:'center',
justifyContent:'center'
  },
  heading:{
   fontSize:30,
   fontWeight:'bold',
   color:'white'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
