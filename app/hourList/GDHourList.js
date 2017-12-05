/**
 * Created by admin on 2017/10/24.
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

export default class GDHourList extends Component<{}> {
    //返回中间按钮
    renderTitleItem(){
        return(
            <TouchableOpacity>
                <Image source={{uri:'navtitle_rank_107x20'}} style={styles.navbarTitleItemStyle} />
            </TouchableOpacity>
        );
    }
    //返回右边按钮
    renderRightItem(){
        return(
            <TouchableOpacity  >
                <Text style={styles.navbarRightItemStyle}>设置</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <GDCommunalNavBar
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}

                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'yellow',
    },
    navbarTitleItemStyle:{
        width:107,
        height:20,
        marginLeft:50,
    },
    navbarRightItemStyle:{

        height:25,
        marginRight:15,
        fontSize:18,
        color:'green'
    }

});
