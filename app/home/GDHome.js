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
    Modal,
    DeviceEventEmitter,
    InteractionManager,
    Animated,
} from 'react-native';
import {PullList} from 'react-native-pull';
import PropTypes from 'prop-types';
// 引用外部文件
import GDCommunalNavBar from '../main/GDCommunalNavBar';
import GDHalfHourHot from './GDHalfHourHot';
import GDSearch from './GDSearch';
import GDNoDataView from '../main/GDNoDataView';
import GDCommunalCell from '../main/GDCommunalCell';
import GDCommunalDetail from'../main/GDCommunalDetail';
import CommunalSift from '../main/GDCommunalSift';
//数据
import HomeSiftData from '../data/HomeSiftData.json';
export default class GDHome extends Component<{}> {
    static defaultProps={
        loadDataNumber:{},//回调
    };
     // 构造
       constructor(props) {
         super(props);
         // 初始状态
         this.state = {
             dataSource:new ListView.DataSource({rowHasChanged:(r1,r2) =>r1 !==r2}),
             loaded:false,
             isSiftModal:false,
         };
           this.data=[];
           this.fetchData=this.fetchData.bind(this);
           this.loadMore=this.loadMore.bind(this);
       }


    //跳转到半小时热门
    pushToHalfHourHot(){
        InteractionManager.runAfterInteractions(() => {
            // ...耗时较长的同步的任务...
            this.props.navigator.push({
                component:GDHalfHourHot
            })
        });

    }
    //跳转到搜索页面
    pushToSearch(){
        InteractionManager.runAfterInteractions(() => {
            // ...耗时较长的同步的任务...
            this.props.navigator.push({
                component:GDSearch,
                params:{
                    name:'首页'
                }
            })
        });

    }
    //显示筛选菜单
    showSiftMenu(){
        this.setState({
            isSiftModal:true,
        })
    }
    //点击cell跳转到详情页
    pushToDetail(value){
        InteractionManager.runAfterInteractions(() => {

            this.props.navigator.push({
                component:GDCommunalDetail,
                params:{
                    uri: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
                }
            })
        });

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
                onPress={()=>this.showSiftMenu()}
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
    //点击了item
    clickTabBarItem(){
        let  PullList=this.refs.pullList;
        if (PullList.scroll.scrollProperties.offset>0){//不在顶部
            PullList.scrollTo({y:0})
        }else {//在顶部，下拉刷新
            //执行下拉刷新操作
            PullList.state.pullPan = new Animated.ValueXY({x: 0, y: this.topIndicatorHeight * -1});
            //加载最新数据
            this.fetchData();
            //关闭动画
            setTimeout(()=> {
                PullList.resetDefaultXYHandler();
            }, 1000);
        }
    }

    componentDidMount() {
        this.fetchData();
        //注册通知
        this.subscription = DeviceEventEmitter.addListener('clickHomeItem', () => this.clickTabBarItem());
    }

    componentWillUnmount() {
        //注销通知
        this.subscription.remove();
    }
    //获取最新数据个数
    loadDataNumber(){
        this.props.loadDataNumber();
    }
    //筛选网络请求
    loadSiftData(mall,cate){

        let params={};
        if (mall === ""&&cate===""){
            this.fetchData();
            return;
        }
        if (mall === ""){
            params ={"country" :"ch","count":"10","cate":cate}
        }
        if (cate===""){
            params ={"country" :"ch","count":"10","mall":mall}
        }
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

                // 存储数组中最后一个元素的id
                let cnlastID = responseData.data[responseData.data.length-1].id;
                AsyncStorage.setItem('cnlastID',cnlastID.toString());
                })
            .catch((error) => {

            })

    }
    //首页网络请求
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
                //获取最新数据个数
                this.loadDataNumber();
                // 存储数组中最后一个元素的id
                let cnlastID = responseData.data[responseData.data.length-1].id;
                AsyncStorage.setItem('cnlastID',cnlastID.toString());
                //存储数组中第一个元素的id
                let cnfirstID=responseData.data[0].id;
                AsyncStorage.setItem('cnfirstID',cnfirstID.toString());
                ////删除本地数据
                //RealmBase.removeAllData('HomeData');
                ////存储数据到本地
                //RealmBase.create('HomeData',responseData.data);
            })
            .catch((error) => {
                //// 拿到本地存储的数据,展示出来,如果没有存储,那就显示无数据页面
                //this.data=RealmBase.loadAll('HomeData');
                ////重新渲染
                //this.setState({
                //    dataSource: this.state.dataSource.cloneWithRows(this.data),
                //    loaded:true,
                //});
            })

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
                let cnlastID = responseData.data[responseData.data.length-1].id;
                AsyncStorage.setItem('cnlastID',cnlastID.toString());

            })
            .catch((error) => {

            })
    }
    //下拉加载更多
    loadMore(){
        //读取ID
        AsyncStorage.getItem('cnlastID')
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
                <PullList ref="pullList"
                    navigator={this.props.navigator}
                    onPullRelease={(resolve)=>this.fetchData(resolve)}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={60}
                    renderFooter={this.renderFooter}
                          removeClippedSubviews={true}
                />
            );
        }
    }
    // 关闭模态
    closeModal(data) {
        this.setState({
            isSiftModal:data,
        })
    }
    onRequestClose() {
        this.setState({
            isSiftModal:false
        });
    }
    render() {

        return (
            <View style={styles.container}>
                {/*筛选菜单*/}
                <Modal
                    animationType='none'           // 没有动画
                    transparent={true}             // 透明
                    visible={this.state.isSiftModal}    // 根据isSiftModal决定是否显示
                    onRequestClose={() => {this.onRequestClose()}}  // android必须实现
                >
                    <CommunalSift
                        removeModal={(data)=>this.closeModal(data)}
                        data={HomeSiftData}
                        loadSiftData={(mall,cate)=>this.loadSiftData(mall,cate)}
                    />
                </Modal>


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
