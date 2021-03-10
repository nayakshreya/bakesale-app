import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, PanResponder, Animated, Dimensions, Button, Linking } from 'react-native';

import { priceDisplay } from '../util';
import ajax from '../ajax';
import { TouchableOpacity } from 'react-native-gesture-handler';

class DealDetail extends React.Component {
    imageXPos = new Animated.Value(0);
    imagePanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gs) => {
            this.imageXPos.setValue(gs.dx);
        },
        onPanResponderRelease: (evt, gs) => {
            this.width = Dimensions.get('window').width;
            if(Math.abs(gs.dx) > this.width * 0.3){
                const direction = Math.sign(gs.dx)
                Animated.timing(this.imageXPos, {
                    toValue: direction * this.width,
                    duration: 250,
                    useNativeDriver: false 
                }).start(() => this.handleSwipe(-1 * direction));
            } else {
                Animated.spring(this.imageXPos, {
                    toValue: 0,
                    useNativeDriver: false 
                }).start();
            }
        },
    });

    handleSwipe = (indexDirection) => {
        if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
            Animated.spring(this.imageXPos, {
                toValue: 0,
                useNativeDriver: false 
            }).start();
            return;
        }
        this.setState((prevState) => ({
                imageIndex: prevState.imageIndex + indexDirection
        }), () => {
            this.imageXPos.setValue(indexDirection * this.width);
                Animated.spring(this.imageXPos, {
                    toValue: 0,
                    useNativeDriver: false 
                }).start();
        }); 
    }

    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    };

    state = {
        deal: this.props.initialDealData,
        imageIndex: 0,
    };

    async componentDidMount() {
        const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
        this.setState({
            deal: fullDeal,
        });
    }

    openDealUrl = () => {
        Linking.openURL(this.state.deal.url);
    };

    render() {
        const { deal } = this.state;
        return (
            <View style={styles.deal}>
                <TouchableOpacity onPress={this.props.onBack}>
                    <Text style={styles.backLink}>Back</Text>
                </TouchableOpacity>
                <Animated.Image 
                    {...this.imagePanResponder.panHandlers}
                    source={{ uri: deal.media[this.state.imageIndex] }}
                    style={[{ left: this.imageXPos }, styles.image]}
                />
                <View style={styles.detail}>
                    <View>
                        <Text style={styles.title}>{deal.title}</Text>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.info}>
                            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
                            <Text style={styles.cause}>{deal.cause.name}</Text>
                        </View>
                        {deal.user && (
                        <View style={styles.user}>
                            <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
                            <Text>{deal.user.name}</Text>
                        </View>
                        )}
                    </View>
                    <View style={styles.content}>
                        <Text>{deal.description}</Text>
                    </View>
                    <TouchableOpacity onPress={this.openDealUrl}>
                        <Text style={styles.appButtonText}>Buy this deal!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backLink: {
        marginBottom: 10,
        
        marginLeft: 15,
        fontSize: 20,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#ccc',
    },
    info: {
        padding: 10,
        backgroundColor: '#fff',
        // borderColor: '#bbb',
        // borderWidth: 1,
        // borderTopWidth: 0,
    },
    title: {
        fontSize: 16,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: 'rgba(237, 149, 45, 0.4)',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },
    cause: {
        flex: 2,
        paddingTop: 10,
    },
    price: {
        flex: 1,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    avatar: {
        width: 60,
        height: 60,
    },
    content: {
        margin: 17,
        padding: 12,
        marginTop: 15,
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 10,
    },
    // appButtonContainer: {
    //     elevation: 8,
    //     backgroundColor: "#4169e1",
    //     borderRadius: 10,
    //     paddingVertical: 10,
    //     paddingHorizontal: 12,
    //     marginLeft: 70,
    //     marginRight: 70,
    //   },
      appButtonText: {
        fontSize: 18,
        color: "#1e90ff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
});

export default DealDetail;