/**
 * Created by admin on 2017/12/6.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    ListView,
} from 'react-native';

import {PullList} from 'react-native-pull';
// 引用外部文件
import GDCommunalNavBar from '../main/GDCommunalNavBar';
import GDCommunalHotCell from '../main/GDCommunalHotCell';
import GDNoDataView from '../main/GDNoDataView';

import GDCommunalDetail from'../main/GDCommunalDetail'
const {width,height} =Dimensions.get('window');
export default class GDUSHalfHourHot extends Component<{}> {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2) =>r1 !==r2}),
            loaded:false,
        };
        this.fetchData=this.fetchData.bind(this);
    }
    //网络请求
    fetchData(resolve){
        let params = {
            "c" : "us"
        };
        HTTPBase.get('http://guangdiu.com/api/gethots.php',params)
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    loaded:true,
                });
                if (resolve !== undefined){
                    setTimeout(() => {
                        resolve();  // 关闭动画
                    }, 1000);
                }
            })
            .catch((error) => {

            })
    }
    pushToDetail(value){
        this.props.navigator.push({
            component:GDCommunalDetail,
            params:{
                uri:'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
            }
        })
    }
    //返回每一行cell的样式
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>{
            this.pushToDetail(rowData.id)
            }}>
                <GDCommunalHotCell
                    image={rowData.image}
                    title={rowData.title}
                /></TouchableOpacity>
        )
    }
    //返回listView的头部
    renderHeader(){
        return(
            <View style={styles.headerPromptStyle}>
                <Text>根据每条折扣的点击进行统计，每五分钟更新一次</Text>
            </View>
        );
    }
    componentDidMount() {
        this.fetchData();
    }
    _pressButton() {
        this.props.navigator.pop();
    }
    //返回中间按钮
    renderTitleItem(){
        return(
            <Text  style={styles.navbarTitleItemStyle} >近半小时热门</Text>
        );
    }
    //返回右边按钮
    renderRightItem(){
        return(
            <TouchableOpacity onPress={()=>this._pressButton()}>
                <Text style={styles.navbarRightItemStyle} >关闭</Text>
            </TouchableOpacity>
        );
    }
    renderListView(){
        if (this.state.loaded ===false) {
            return(
                <GDNoDataView />
            );
        }else{
            return(
                <PullList navigator={this.props.navigator}
                          onPullRelease={(resolve)=>this.fetchData(resolve)}
                          dataSource={this.state.dataSource}
                          renderRow={this.renderRow.bind(this)}
                          renderHeader={this.renderHeader}
                />
            );
        }

    }

    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <GDCommunalNavBar
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}
                />

                {/*根据网络状态决定是否渲染listView*/}
                {this.renderListView()}

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },

    navbarTitleItemStyle:{
        fontSize:17,
        color:'black',
        marginLeft:50,
    },
    navbarRightItemStyle:{
        fontSize:17,
        color:'green',
        marginRight:15,
    },
    headerPromptStyle:{
        width:width,
        height:44,
        backgroundColor:'rgba(239,239,239,0.5)',
        justifyContent:'center',
        alignItems:'center',
    },
});

