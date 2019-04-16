/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
import NavigationUtil from '../navigator/NavigationUtil'

type Props = {};
export default class PopularPage extends Component<Props> {
    render() {
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
            PopularTab1: {
                screen: PopularTab,
                navigationOptions: {
                    title: "Tab1"
                }
            }, PopularTab2: {
                screen: PopularTab,
                navigationOptions: {
                    title: "Tab2"
                }
            },

        }));
        return (
            <View style={{flex: 1}}>
                <TabNavigator/>
            </View>
        );
    }
}

class PopularTab extends Component<Props> {
    render() {
        const {tabLabel} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>{tabLabel}</Text>
                <Text onPress={()=>{
                    NavigationUtil.goPage({},'DetailPage')
                }}>跳转到详情页</Text>
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
