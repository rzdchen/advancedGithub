/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter,
    FlatList,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
import NavigationBar from '../common/NavigationBar'
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import {onFlushTrendingFavorite} from "../action/trending";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

const URL = 'https://github.com/trending/';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
type Props = {};
const THEME_COLOR = '#678';

class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            timeSpan: TimeSpans[0],
        };
        const {onLoadLanguage} = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_language);
        this.preKeys = [];
    }

    _genTabs() {
        const tabs = {};
        const {keys} = this.props;
        this.preKeys = keys;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <TrendingTabPage {...props} tabLabel={item.name}/>,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        });

        return tabs;
    }

    renderTitleView() {
        return <View>
            <TouchableOpacity
                underlayColor='transparent'
                onPress={() => this.dialog.show()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color: 'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab
        });
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
    }

    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        />
    }

    _tabNav() {
        if (this.tabNav && ArrayUtil.isEqual(this.preKeys, this.props.keys)) {
            return this.tabNav;
        }
        return this.tabNav = createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,//是否使标签大写，默认为true
                    scrollEnabled: true,//是否支持 选项卡滚动，默认false
                    style: {
                        backgroundColor: 'grey',//TabBar 的背景颜色
                        height: 30,//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
                        alignItems: 'center',
                    },
                    indicatorStyle: styles.indicatorStyle,//标签指示器的样式
                    labelStyle: styles.labelStyle,//文字的样式
                }
            }
        ));
    }

    render() {
        const {keys} = this.props;
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />;
        const TabNavigator = keys.length ? this._tabNav() : null;
        return (
            <View style={{flex: 1}}>
                {navigationBar}
                {TabNavigator && <TabNavigator/>}
                {this.renderTrendingDialog()}
            </View>
        );
    }
}

const mapTrendingStateToProps = state => ({
    keys: state.language.keys,
    // theme: state.theme.theme,
});
const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
/注意：connect只是个function，并不应定非要放在export后面
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);


const pageSize = 10;//设为常量，防止修改
class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
    }

    componentDidMount() {
        this.loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan;
            this.loadData();
        });
        EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true;
        });
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null, true);
            }
        })
    }

    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    }

    loadData(loadMore, refreshFavorite) {
        const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
        const store = this._store();
        const url = this.getFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了');
            })
        } else if (refreshFavorite) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onRefreshTrending(this.storeName, url, pageSize, favoriteDao);
        }
    }

    /**
     * 获取与当前页面有关的数据
     * @returns {*}
     * @private
     */
    _store() {
        const {trending} = this.props;
        let store = trending[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],//要显示的数据
                hideLoadingMore: true,//默认隐藏加载更多
            }
        }
        return store;
    }

    getFetchUrl(key) {
        return URL + key + '?since=daily';
    }

    renderItem(data) {
        const item = data.item;
        return <TrendingItem
            projectModel={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    // theme,
                    projectModel: item,
                    flag: FLAG_STORAGE.flag_trending,
                    callback,
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
        />;
    }

    genIndicator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }

    render() {
        let store = this._store();
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.fullName}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        console.log("-onEndReached---");
                        setTimeout(() => {
                            if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                                this.loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100);
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                        console.log('---onMomentumScrollBegin-----')
                    }}
                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    trending: state.trending
});
const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    tabStyle: {
        // minWidth: 40
        padding: 0,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    labelStyle: {
        fontSize: 13,
        margin: 0,
    },
    indicator: {
        color: 'red',
        margin: 10
    },
    indicatorContainer: {
        alignItems: "center"
    },
});
