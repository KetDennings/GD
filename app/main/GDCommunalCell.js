/**
 * Created by admin on 2017/12/1.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
const {width,height} =Dimensions.get('window');
export default class GDCommunalCell extends Component<{}> {
    static propTypes={
        image:PropTypes.string,
        title:PropTypes.string,
        mall:PropTypes.string,
        fromsite:PropTypes.string,
        pubtime:PropTypes.string,
    }
    renderDate(pubTime,fromsite){
        //时间差的计算
        let minute=60*1000 ;//1分钟
        let hour=60*minute;//1小时
        let day =24*hour;//1天
        let week = day * 7;
        let month =30*day;//1月

        //计算时间差
        let now=new Date().getTime();//获取当前时间
        let diffValue=now- Date.parse(pubTime.replace(/-/gi, "/"));

        if (diffValue<0) return;
        let monthC=diffValue/month; //相差几个月
        let weekC=diffValue/week;//相差几个周
        let dayC=diffValue/day;//相差几个天
        let hourC=diffValue/hour;//相差几个小时
        let minuteC=diffValue/minute;//相差几个分钟
        let result;

        if (monthC>=1) {
            result = parseInt(monthC)+"月前";
        }else if(weekC>=1){
            result = parseInt(weekC)+"周前";
        }else if(dayC>=1){
            result = parseInt(dayC)+"天前";
        }else if(hourC>=1){
            result = parseInt(hourC)+"小时前";
        }else if(minuteC>=1){
            result = parseInt(minuteC)+"分钟前";
        }else{
            result="刚刚";
        }
        return result + ' · '+fromsite;
    }
    render() {
        return (
            <View style={styles.container}>
                {/* 左边图片*/}
                <Image source={{uri:this.props.image}} style={styles.imageStyle}/>
                {/*中间的文字*/}
                <View style={styles.centerViewStyle}>
                    <Text numberOfLines={3} style={styles.titleStyle}>{this.props.title}</Text>
                    {/* 详情 */}
                    <View style={styles.detailViewStyle}>
                        {/* 平台 */}
                        <Text style={styles.detailMallStyle}>{this.props.mall}</Text>
                        {/* 时间 + 来源 */}
                        <Text style={styles.timeStyle}>{this.renderDate(this.props.pubtime,this.props.fromsite)}</Text>
                    </View>
                </View>
                {/* 右边的图片*/}
                <Image source={{uri:'icon_cell_rightarrow'}} style={styles.arrowStyle}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        height:100,
        width:width,
        borderBottomWidth:0.5,
        borderBottomColor:'gray',
        marginLeft:15,
    },
    imageStyle:{
        width:70,
        height:70,

    },
    arrowStyle:{
        width:10,
        height:10,
        marginRight:30,
    },
    centerViewStyle: {
        height:70,
        justifyContent:'space-around',
    },
    titleStyle:{
        width:width * 0.65 ,
    },
    detailViewStyle:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    detailMallStyle:{
        fontSize:12,
        color:'green',
    },
    timeStyle:{
        fontSize:12,
        color:'gray'
    },
});
