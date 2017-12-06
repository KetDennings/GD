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
    ActivityIndicator,
    AsyncStorage,
} from 'react-native';
import {PullList} from 'react-native-pull';
// 引用外部文件
import GDCommunalNavBar from '../main/GDCommunalNavBar';
import GDHalfHourHot from './GDHalfHourHot';
import GDSearch from './GDSearch';
import GDNoDataView from '../main/GDNoDataView';
import GDCommunalHotCeli from '../main/GDCommunalHotCeli';
import HTTPBase from '../http/HTTPBase';
export default class GDHome extends Component<{}> {
     // 构造
       constructor(props) {
         super(props);
         // 初始状态
         this.state = {
             dataSource:new ListView.DataSource({rowHasChanged:(r1,r2) =>r1 !==r2}),
             loaded:false,
         };
           this.data=[];
           this.fetchData=this.fetchData.bind(this);
           this.loadMore=this.loadMore.bind(this);
       }
    //跳转到半小时热门
    pushToHalfHourHot(){
        this.props.navigator.push({
            component:GDHalfHourHot
        })
    }
    //跳转到搜索页面
    pushToSearch(){
        this.props.navigator.push({component:GDSearch})
    }
    //返回左边按钮
    renderLeftItem(){
        return(
            <TouchableOpacity
                onPress={() =>this.pushToHalfHourHot() }
            ><Image source={{uri:'hot_icon_20x20'}} style={styles.navbarLeftItemStyle} />
            </TouchableOpacity>
        );

    }

    //返回中间按钮
    renderTitleItem(){
        return(
            <TouchableOpacity
               >
                <Image source={{uri:'navtitle_home_down_66x20'}} style={styles.navbarTitleItemStyle} />
            </TouchableOpacity>
        );
    }
    //返回右边按钮
    renderRightItem(){
        return(
            <TouchableOpacity
                onPress={() => this.pushToSearch()}
            >
                <Image source={{uri:'search_icon_20x20'}} style={styles.navbarRightItemStyle} />
            </TouchableOpacity>
        );
    }
    componentDidMount() {
        this.fetchData();
    }
    //网络请求
    fetchData(resolve){
        let params={"country" :"ch","count":"10"};
        HTTPBase.get('https://guangdiu.com/api/getlist.php',params)
            .then((responseData) => {
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
                let lastID = responseData.data[responseData.data.length-1].id;
                console.log(responseData.data);
                AsyncStorage.setItem('lastID',lastID.toString());

            })
            .catch((error) => {

            })

    }
    //返回每一行cell的样式
    renderRow(rowData){
        return(
            <GDCommunalHotCeli
                image={rowData.image}
                title={rowData.title}
            />
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
    // 加载更多数据的网络请求
    loadMoreData(value){
        let params={
            "country" :"ch",
            "count":"10",
            "sinceid":value};
        HTTPBase.get('https://guangdiu.com/api/getlist.php',params)
            .then((responseData) => {
                //拼接数据
                this.data=this.data.concat(responseData.data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded:true,
                });
                // 存储数组中最后一个元素的id
                let lastID = responseData.data[responseData.data.length-1].id;
                AsyncStorage.setItem('lastID',lastID.toString());

            })
            .catch((error) => {

            })
    }
    //下拉加载更多
    loadMore(){
        //读取ID
        AsyncStorage.getItem('lastID')
            .then((value) => {
                this.loadMoreData(value);
            })

    }
    //listView
    renderListView(){
        if (this.state.loaded ===false) {
            return(
                <GDNoDataView />
            );
        }else{
            return(
                <PullList
                    onPullRelease={(resolve)=>this.fetchData(resolve)}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
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
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle:{
        width:66,
        height:20,
    },
    navbarRightItemStyle:{
        width:20,
        height:20,
        marginRight:15,
    },
});
