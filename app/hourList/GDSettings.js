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
} from 'react-native';
// 引用外部文件

import GDCommunalNavBar from '../main/GDCommunalNavBar';
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
                <Text  style={styles.navbarLeftItemStyle} >小时风云榜</Text>
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
                <View>

                </View>
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
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle:{
        width:66,
        height:20,
    },


});