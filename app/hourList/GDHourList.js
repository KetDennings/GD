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
import GDNoDataView from '../main/GDNoDataView';
import GDCommunalCell from '../main/GDCommunalCell';
import GDCommunalDetail from'../main/GDCommunalDetail';
import GDSettings from  './GDSettings';
const {width,height} =Dimensions.get('window');
export default class GDHourList extends Component<{}> {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2) =>r1 !==r2}),
            loaded:false,
        };
        this.loadData=this.loadData.bind(this);
    }
    //跳转到设置页面
    pushToSettings(){
        this.props.navigator.push({component:GDSettings})
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
    //返回中间按钮
    renderTitleItem(){
        return(
                <Image source={{uri:'navtitle_rank_107x20'}} style={styles.navbarTitleItemStyle} />
        );
    }
    //返回右边按钮
    renderRightItem(){
        return(
            <TouchableOpacity
                onPress={()=>{
                this.pushToSettings()
                }}>
                <Text style={styles.navbarRightItemStyle}>设置</Text>
            </TouchableOpacity>
        );
    }
    componentDidMount() {
        this.loadData();
    }
    //网络请求
    loadData(resolve){
        let params={"country" :"ch","count":"10"};
        HTTPBase.get('https://guangdiu.com/api/getranklist.php')
            .then((responseData) => {

                // 重新渲染
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    loaded:true,
                });
                // 关闭刷新动画
                if (resolve !== undefined){
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }
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
                {/*提醒栏*/}
                <View style={styles.promptViewStyle}>
                    <Text>提示栏</Text>
                </View>
                {/*根据网络状态决定是否渲染listView*/}
                {this.renderListView()}
                {/*操作栏*/}
                <View style={styles.operationViewStyle}>
                    <TouchableOpacity>
                        <Text style={{marginRight:10,fontSize:17,color:'green'}}>
                            {"< " + "上1小时"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={{marginLeft:10,fontSize:17,color:'green'}}>
                            {"下1小时"+" >"}</Text>
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
        height:25,
        marginRight:15,
        fontSize:18,
        color:'green'
    },
    promptViewStyle:{
        width:width,
        height:44,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(251,251,251,1.0)',
    },
    operationViewStyle:{
        width:width,
        height:44,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },



});
