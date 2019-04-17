/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";


type Props = {};
export default class HomePage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Home</Text>
                <Text onPress={() => {
                    NavigationUtil.goPage({}, 'DetailPage')
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
        justifyContent: 'center',
        alignItems: 'center',
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
