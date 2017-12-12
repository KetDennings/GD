/**
 * Created by admin on 2017/12/11.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native';
// 引用外部文件


import PropTypes from 'prop-types';
export default class GDSettings extends Component<{}> {

    static PropTypes={
        leftTitle:PropTypes.string,
        isShowSwitch:PropTypes.bool,
    }
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOn:false,
        };
      }
    //返回需要的组件
    renderRightContent(){
        let component;
        if(this.props.isShowSwitch){
            component=<Switch
                value={this.state.isOn}
                onValueChange={()=>{
                   this.setState({
                       isOn:!this.state.isOn
                   })}}
            />
        }else{
            component= <Image source={{uri:'icon_cell_rightarrow'}} style={styles.arrowStyle}/>

        }
        return (component)
    }
    render() {
        return (
            <View style={styles.container}>
                {/*左边*/}
                <View >
                    <Text >{this.props.leftTitle}</Text>
                </View>
                {/*右边*/}
                <View style={styles.rightViewStyle}>
                    {this.renderRightContent()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height:Platform.OS === 'ios'?44:36,
        justifyContent:'space-between',
        borderBottomWidth:0.5,
        borderBottomColor:'gray',
        marginLeft:15,

    },

    rightViewStyle:{
        marginRight:15,
    },
    arrowStyle:{
        width:10,
        height:10,

    },



});