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
    Dimensions,
    ListView,
    ActivityIndicator,
    AsyncStorage,
    TextInput,
} from 'react-native';
// 引用外部文件
import {PullList} from 'react-native-pull';
import GDCommunalNavBar from '../main/GDCommunalNavBar';
import GDNoDataView from '../main/GDNoDataView';
import GDCommunalCell from '../main/GDCommunalCell';
import GDCommunalDetail from'../main/GDCommunalDetail'
import PropTypes from 'prop-types';
const {width,height} =Dimensions.get('window');
const dismissKeyboard =require('dismissKeyboard');
export default class GDSearch extends Component<{}> {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2) =>r1 !==r2}),
            loaded:false,
        };
        this.data=[];
        this.changeText = '';
        this.fetchData=this.fetchData.bind(this);
        this.loadMore=this.loadMore.bind(this);
    }
    _pressBackButton(){
        // 回收键盘
        dismissKeyboard();
        this.props.navigator.pop();
    }
    //点击cell跳转到详情页
    pushToDetail(value){
        this.props.navigator.push({
            component:GDCommunalDetail,
            params:{
                uri: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
            }
        })
    }
    //返回左边按钮
    renderLeftItem(){
        return(
            <TouchableOpacity
                onPress={() =>{this._pressBackButton()}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Image source={{uri:'back'}} style={styles.navbarLeftItemStyle}/>
                <Text  style={{color:'green'}}>首页</Text>
                </View>
            </TouchableOpacity>
        );

    }
    //返回中间按钮
    renderTitleItem(){
        return(
            <TouchableOpacity>
                <Text  style={styles.navbarTitleItemStyle} >搜索全网折扣</Text>
            </TouchableOpacity>
        );
    }

    //网络请求
    fetchData(resolve){
        if (this.changeText === undefined) return;

        let params={"q" :this.changeText,"count":"10"};
        HTTPBase.get('https://guangdiu.com/api/getresult.php',params)
            .then((responseData) => {
                console.log(responseData);
                // 清空数组
                this.data = [];
                //拼接数据
                this.data=this.data.concat(responseData.data);
                // 重新渲染
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded:true,
                });

                // 关闭刷新动画
                if (resolve !== undefined){
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }
                // 存储数组中最后一个元素的id
                let searchlastID = responseData.data[responseData.data.length-1].id;
                AsyncStorage.setItem('searchlastID',searchlastID.toString());
            })
            .catch((error) => {

            })

    }
    // 加载更多数据的网络请求
    loadMoreData(value){
        let params={
            "q" :this.changeText,
            "count":"10",
            "sinceid":value};
        HTTPBase.get('https://guangdiu.com/api/getresult.php',params)
            .then((responseData) => {
                //拼接数据
                this.data=this.data.concat(responseData.data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded:true,
                });
                // 存储数组中最后一个元素的id
                let searchlastID = responseData.data[responseData.data.length-1].id;
                AsyncStorage.setItem('searchlastID',searchlastID.toString());

            })
            .catch((error) => {

            })
    }
    //下拉加载更多
    loadMore(){
        //读取ID
        AsyncStorage.getItem('searchlastID')
            .then((value) => {
                this.loadMoreData(value);
            })

    }
    //返回每一行cell的样式
    renderRow(rowData){
        return(
            <TouchableOpacity
                onPress={()=>{
                this.pushToDetail(rowData.id)

            }}>
                <GDCommunalCell
                    image={rowData.image}
                    title={rowData.title}
                    mall={rowData.mall}
                    fromsite={rowData.fromsite}
                    pubtime={rowData.pubtime}
                />
            </TouchableOpacity>
        )
    }
    //listView的尾部
    renderFooter() {

        return (
            <View style={{height: 100}}>
                <ActivityIndicator />
            </View>
        );
    }


    //listView
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
                          onEndReached={this.loadMore}
                          onEndReachedThreshold={60}
                          renderFooter={this.renderFooter}
                />
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <GDCommunalNavBar
                    leftItem = {() => this.renderLeftItem()}
                    titleItem = {() => this.renderTitleItem()}
                />
                {/*顶部工具栏*/}
                <View style={styles.toolsViewStyle}>
                    {/*输入框*/}
                    <View style={styles.inputViewStyle}>
                        <Image source={{uri:'search_icon_20x20'}} style={styles.searchImageStyle}/>
                        <TextInput style={styles.inputStyle}
                                   keyboardType='default'
                                   placeholder="请输入搜索商品关键字"
                                   placeholderTextColor='gray'
                                   autoFocus={true}
                                   onChangeText={(text)=>this.changeText=text}
                                   onEndEditing={() => this.fetchData()}
                        />
                    </View>
                    {/*取消*/}
                    <View  style={styles.ButtonViewStyle}>
                        <TouchableOpacity onPress={()=>{this._pressBackButton()}}>
                            <Text style={{color:'green'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle:{
        fontSize:17,
        color:'black',
        marginRight:50
    },
    toolsViewStyle:{
        width:width,
        height:44,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
       justifyContent:'space-between',



    },
    inputViewStyle:{

        height:35,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(239,239,239,0.5)',
        marginLeft:10,
        borderRadius:5,
    },
    searchImageStyle:{
        width:15,
        height:15,
        marginLeft:8,
    },
    inputStyle:{
        width:width*0.75,
        height:35,
        marginLeft:8,
    },
    ButtonViewStyle:{
        marginRight:10,

    },


});