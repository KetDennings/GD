/**
 * Created by admin on 2017/12/5.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    View,
    Dimensions,
} from 'react-native';
// 引用外部文件
import Main from './Main'
import PropTypes from 'prop-types';
const {width,height}=Dimensions.get('window');
export default class GDLaunchPage extends Component<{}> {
    componentDidMount() {
        setTimeout(()=>{
            this.props.navigator.replace({
                component:Main,
            })
        },1500)
    }
    render() {
        return(
            <Image source={{uri:'LaunchImage'}} style={styles.imageStyle} />
        )

    }

}
const styles=StyleSheet.create({
    imageStyle:{
        width:width,
        height:height,
}
})