/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux'
import {onThemeChange} from '../action/theme'


type Props = {};
class FavoritePage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Home</Text>
                <Button
                    title="改变主题色"
                    onPress={() => {
                        // let {dispatch} = this.props.navigation;
                        // dispatch(onThemeChange('red'))
                        this.props.onThemeChange('#096');
                    }}
                />
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

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(onThemeChange(theme)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);
