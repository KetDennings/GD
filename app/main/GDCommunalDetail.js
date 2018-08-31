/**
 * Created by admin on 2017/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    TouchableOpacity,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
//引入外部文件
import GDCommunalNavBar from './GDCommunalNavBar';
export default class GDCommunalDetail extends Component<{}> {
    static propTypes = {
        uri:PropTypes.string,
    };
    //返回左边按钮
    renderLeftItem(){
        return (
            <TouchableOpacity
                onPress={()=>{
                    this.props.navigator.pop();
                }}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <Image source={{uri:'back'}} style={styles.navbarLeftItemStyle}/>
                    <Text  style={{color:'green'}}>返回</Text>
                </View>
            </TouchableOpacity>
        )
    }
    //返回中间按钮
    renderTitleItem(){
        return(

            <Text  style={styles.navbarTitleItemStyle} >商品详情</Text>

        );
    }
    render(){
        return (
            <View style={styles.container}>
                {/*导航栏*/}
                <GDCommunalNavBar
                    leftItem={()=>this.renderLeftItem()}
                    titleItem = {() => this.renderTitleItem()}
                />
                {/*初始化*/}
                <WebView style={styles.webStyle}
                         source={{uri:this.props.uri,method:'GET'}}
                         javaScriptEnabled={true}
                         domStorageEnabled={true}
                         scalesPageToFit={false}
                />


            </View>
        );
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    webStyle:{
        flex:1,
    },
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle:{
        fontSize:17,
        color:'black',
        marginRight:90
    },
});