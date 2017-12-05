

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
//引用第三方框架
import TabNavigator from 'react-native-tab-navigator';


//引用外部文件
import  GDHome from '../home/GDHome'
import  GDHt from '../ht/GDHt'
import  GDHourList from '../hourList/GDHourList'


export default class Main extends Component<{}> {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab:'home'
        };

      }

    // 返回TabBar的Item
    renderTabBarItem(title, selectedTab, image, selectedImage, view ) {
        return(
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={{color:'black'}}
                renderIcon={() => <Image source={{uri:image}} style={styles.tabbarIconStyle} />}
                renderSelectedIcon={() => <Image source={{uri:selectedImage}} style={styles.tabbarIconStyle} />}
                onPress={() => this.setState({ selectedTab: selectedTab })}>
                    {view }
            </TabNavigator.Item>
        );
    }

    render() {
        return (
            <TabNavigator>
                {/* 首页 */}
                {this.renderTabBarItem("首页",'home','tabbar_home_30x30','tabbar_home_selected_30x30',<GDHome  navigator={this.props.navigator}/>)}
                {/* 海淘 */}
                {this.renderTabBarItem("海淘",'ht','tabbar_abroad_30x30','tabbar_abroad_selected_30x30',<GDHt  navigator={this.props.navigator}/>)}
                {/* 小时风云榜 */}
                {this.renderTabBarItem("小时风云榜",'hourlist','tabbar_rank_30x30','tabbar_rank_selected_30x30',<GDHourList  navigator={this.props.navigator}/>)}
            </TabNavigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    tabbarIconStyle: {
        width:Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25,
    }


});
