/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
// 引用外部文件
import Main from './app/main/Main';
import GDLaunchPage from './app/main/GDLaunchPage'
import { Navigator } from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';

export default class App extends Component<{}> {
  render() {

    var defaultName = 'GDLaunchPage';
    var defaultComponent = GDLaunchPage;
    return (

        <Navigator
            //指定了默认的页面，也就是启动app之后会看到的第一屏，需要两个参数，name跟component
            initialRoute={{ name: defaultName, component: defaultComponent }}
            configureScene={(route) => {
            //跳转的动画
            return Navigator.SceneConfigs.FadeAndroid;
          }}
            renderScene={(route, navigator) => {
            let Component = route.component;
            if(route.component){
                return <Component {...route.params} navigator={navigator} />
            }
          }} />
    );
  }

}

