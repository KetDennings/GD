/**
 * Created by admin on 2017/12/4.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
// 引用外部文件
const {width,height} =Dimensions.get('window');
import GDCommunalNavBar from '../main/GDCommunalNavBar';
import GDSettingsCell from './GDSettingsCell';
import PropTypes from 'prop-types';
export default class GDSettings extends Component<{}> {

    _pressBackButton(){
        this.props.navigator.pop();
    }
    //返回左边按钮
    renderLeftItem(){
        return(
            <TouchableOpacity
                onPress={() =>{this._pressBackButton()}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <Image source={{uri:'back'}} style={styles.navbarLeftItemStyle}/>
                    <Text  style={{color:'green'}}>小时风云榜</Text>
                </View>

            </TouchableOpacity>
        );

    }
    //返回中间按钮
    renderTitleItem(){
        return(

                <Text  style={styles.navbarTitleItemStyle} >设置</Text>

        );
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <GDCommunalNavBar
                    leftItem = {() => this.renderLeftItem()}
                    titleItem = {() => this.renderTitleItem()}
                />
                {/*内容*/}
                <ScrollView style={styles.scrollViewStyle}>
                    <GDSettingsCell
                        leftTitle="淘宝天猫快捷下单"
                        isShowSwitch={true}
                    />
                    <GDSettingsCell
                        leftTitle="清除图片缓存"
                        isShowSwitch={false}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'pink',
    },
    scrollViewStyle:{
        backgroundColor:'white',
        width:width,
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