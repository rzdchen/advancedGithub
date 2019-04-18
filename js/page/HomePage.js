/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import BackPressComponent from '../common/BackPressComponent';


type Props = {};
class HomePage extends Component<Props> {

    constructor(){
        super(props);
        this.backPress = new BackPressComponent({backPress: this.onBackPress});
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /**
     * 处理Android中的物理返回键
     * @returns {boolean}
     */
    onBackPress = () => {
        const {dispatch, nav} = this.props;
        if (nav.routes[1].index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };

    render() {
        //把navigation保存到NavigationUtil中，保证其他NavigationContainer下的页面能跳转到此NavigationContainer下的页面。
        NavigationUtil.navigation = this.props.navigation;
        return <DynamicTabNavigator/>
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});
export default connect(mapStateToProps)(HomePage)
