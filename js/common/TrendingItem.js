import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native'
import HTMLView from "react-native-htmlview/HTMLView";
import BaseItem from "./BaseItem";

export default class TrendingItem extends BaseItem {
    render() {
        const {projectModel} = this.props;
        const {item} = projectModel;
        // const item = projectModel;
        // const {item} = this.props;
        if (!item) return null;
        let description = '<p>' + item.description + '</p>';
        return (
            <TouchableOpacity
                onPress={()=>this.onItemClick()}
                // onPress={() => (this.props.onSelect)}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.fullName}
                    </Text>
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {

                        }}
                        stylesheet={{
                            p: styles.description,
                            a: styles.description,
                        }}
                    />
                    <Text style={styles.description}>
                        {item.meta}
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            {item.contributors.map((result, i, arr) => {
                                return <Image style={{height: 22, width: 22}}
                                              source={{uri: arr[i]}}
                                />
                            })}
                        </View>
                        {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
                        {/*    <Text>Start:</Text>*/}
                        {/*    <Text>{item.starCount}</Text>*/}
                        {/*</View>*/}
                        {this._favoriteIcon()}
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
        cell_container: {
            backgroundColor: 'white',
            padding: 10,
            marginLeft: 5,
            marginRight: 5,
            marginVertical: 3,
            borderColor: '#dddddd',
            borderWidth: 0.5,
            borderRadius: 2,
            shadowColor: 'gray',
            shadowOffset: {width: 0.5, height: 0.5},
            shadowOpacity: 0.4,
            shadowRadius: 1,
            elevation: 2
        },
        row: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontSize: 16,
            marginBottom: 2,
            color: '#212121',
        },
        description: {
            fontSize: 14,
            marginBottom: 2,
            color: '#757575',
        }
    }
);