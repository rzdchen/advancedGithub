/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar'
import {impureFinalPropsSelectorFactory} from "react-redux/es/connect/selectorFactory";
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

const THEME_COLOR = '#678';
type Props = {};
export default class HomePage extends Component<Props> {
    getRightButton() {
        return <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                onPress={() => {
                }}
            >
                <View style={{padding: 5, marginRight: 8}}>
                    <Feather
                        name={'search'}
                        size={24}
                        style={{color: "white"}}
                    />
                </View>

            </TouchableOpacity>

        </View>
    }

    getLeftButton() {
        return <TouchableOpacity
            style = {{padding: 8,paddingLeft:12}}
            onPress={()=>{}}
        >
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color:'white'}}
            />
        </TouchableOpacity>
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar
            title={'我的'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
            rightButton={this.getRightButton()}
            leftButton={this.getLeftButton()}
        />;
        return (
            <View style={styles.container}>
                {navigationBar}
                <Text style={styles.welcome}>Home</Text>
                <Text onPress={() => {
                    // NavigationUtil.goPage({}, 'DetailPage')
                }}>跳转到详情页</Text>
                <Button
                    title={'调试 fetch'}
                    onPress={() => {
                        NavigationUtil.goPage({}, 'FetchDemoPage')
                    }}/>
                <Button
                    title={'调试 AsyncStorage'}
                    onPress={() => {
                        NavigationUtil.goPage({}, 'AsyncStorageDemoPage')
                    }}/>
                <Button
                    title={'调试 DataStore'}
                    onPress={() => {
                        NavigationUtil.goPage({}, 'DataStoreDemoPage')
                    }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
