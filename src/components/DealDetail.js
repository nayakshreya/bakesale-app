import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';

import { priceDisplay } from '../util';
import ajax from '../ajax';
import { TouchableOpacity } from 'react-native-gesture-handler';

class DealDetail extends React.Component {
    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    };

    state = {
        deal: this.props.initialDealData,
    };

    async componentDidMount() {
        const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
        this.setState({
            deal: fullDeal,
        });
    }

    render() {
        const { deal } = this.state;
        return (
            <View style={styles.deal}>
                <TouchableOpacity onPress={this.props.onBack}>
                    <Text style={styles.backLink}>Back</Text>
                </TouchableOpacity>
                <Image 
                    source={{ uri: deal.media[0] }}
                    style={styles.image}
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
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    deal: {
        marginHorizontal: 12,
        // marginTop: 50,
    },
    backLink: {
        marginBottom: 5,
        color: '#22f',
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc',
    },
    detail: {
        borderColor: '#bbb',
        borderWidth: 1,
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
        padding: 13,
    },
});

export default DealDetail;