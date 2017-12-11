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
    Dimensions,
    ListView,
} from 'react-native';

import {PullList} from 'react-native-pull';
// 引用外部文件
import GDCommunalNavBar from '../main/GDCommunalNavBar';
import GDCommunalCell from '../main/GDCommunalCell';
import GDNoDataView from '../main/GDNoDataView';
import GDSettings from './GDSettings';
import GDCommunalDetail from'../main/GDCommunalDetail';
const {width,height} =Dimensions.get('window');
export default class GDHourList extends Component<{}> {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2) =>r1 !==r2}),
            loaded:false,
            txt:""
        };
        this.lasthourhour='';
        this.lasthourdate='';
        this.nexthourhour='';
        this.nexthourdate='';
        this.fetchData=this.fetchData.bind(this);
    }
    //网络请求
    fetchData(resolve,date,hour){
        let params;
        if (date!== undefined){
            params={
                "date":date,
                "hour":hour
            }
        }
        HTTPBase.get('http://guangdiu.com/api/getranklist.php',params)
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    loaded:true,
                    txt:responseData.displaydate+responseData.rankhour+"点档("+responseData.rankdate+")"
                });
                this.nexthourhour=responseData.nexthourhour;
                this.nexthourdate=responseData.nexthourdate;
                this.lasthourhour=responseData.lasthourhour;
                this.lasthourdate=responseData.lasthourdate;

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
                <GDCommunalCell
                    image={rowData.image}
                    title={rowData.title}
                    mall={rowData.mall}
                    fromsite={rowData.fromsite}
                    pubtime={rowData.pubtime}
                /></TouchableOpacity>
        )
    }

    componentDidMount() {
        this.fetchData();
    }
    pushToSettings() {
        this.props.navigator.push({
            component:GDSettings
        });
    }
    //返回中间按钮
    renderTitleItem(){
        return(
            <Image source={{uri:'navtitle_rank_107x20'}} style={styles.navbarTitleItemStyle} />
        );
    }
    //返回右边按钮
    renderRightItem(){
        return(
            <TouchableOpacity onPress={()=>this.pushToSettings()}>
                <Text style={styles.navbarRightItemStyle} >设置</Text>
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

                />
            );
        }

    }
    lastHour(){
        this.fetchData(undefined,this.lasthourdate,this.lasthourhour)
    }
    nextHour(){
        this.fetchData(undefined,this.nexthourdate,this.nexthourhour)
    }
    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <GDCommunalNavBar
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}
                />
                {/* 提醒栏 */}
                <View style={styles.promptViewStyle}>
                    <Text>{this.state.txt}</Text>
                </View>
                {/*根据网络状态决定是否渲染listView*/}
                {this.renderListView()}
                {/* 操作栏 */}
                <View style={styles.operationViewStyle}>
                    <TouchableOpacity
                        onPress={() => this.lastHour()}
                    >
                        <Text style={{marginRight:10, fontSize:17, color:'green'}}>{"< " + "上1小时"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.nextHour()}
                    >
                        <Text style={{marginLeft:10, fontSize:17, color:'green'}}>{"下1小时" + " >"}</Text>
                    </TouchableOpacity>
                </View>
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
        width:107,
        height:20,
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
    promptViewStyle: {
        width:width,
        height:44,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(251,251,251,1.0)',
    },

    operationViewStyle: {
        width:width,
        height:44,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
});
