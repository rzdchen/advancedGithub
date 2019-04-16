/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {createAppContainer, createBottomTabNavigator} from "react-navigation";
import {BottomTabBar} from 'react-navigation-tabs';
import PopularPage from "../page/PopularPage";
import TrendingPage from "../page/TrendingPage";
import FavoritePage from "../page/FavoritePage";
import MyPage from "../page/MyPage";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import NavigationUtil from "../navigator/NavigationUtil";
import {connect} from 'react-redux';


type Props = {};
const TABS = {//在这里配置页面的路由
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        }
    }, TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: "趋势",
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        }
    }, FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: "收藏",
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        }
    }, MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({tintColor, focused}) => (
                <Entypo
                    name={'user'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        }
    },
};

class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;//禁掉黄色警告
    }

    _tabNavigator() {
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};//根据需要定制显示的tab
        PopularPage.navigationOptions.tabBarLabel = '最热';//动态配置Tab属性
        return createAppContainer(createBottomTabNavigator(tabs, {
            tabBarComponent: props => {
                return <TabBarComponent
                    theme={this.props.theme}
                    {...props}
                />
            },
        }));
    }

    render() {
        const Tab = this._tabNavigator();
        //把navigation保存到NavigationUtil中，保证其他NavigationContainer下的页面能跳转到此NavigationContainer下的页面。
        NavigationUtil.navigation = this.props.navigation;
        return <Tab/>
    }
}

class TabBarComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime(),
        }
    }

    render() {
        const {routes, index} = this.props.navigation.state;
        if (routes[index].params) {
            const {theme} = routes[index].params;
            //以最新的修改为主
            if (theme && theme.updateTime > this.theme.updateTime) {
                this.theme = theme;
            }
        }
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.theme.tintColor || this.theme.activeTintColor}
        />
    }
}

const mapStateToProps = state => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);