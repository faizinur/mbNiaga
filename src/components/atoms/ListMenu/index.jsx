import React from 'react';
import PropTypes from 'prop-types'
import { log } from '../../../utils/';
import { Block, Col, Row } from 'framework7-react';
import { ic_camera } from '../../../assets/img/';
// import { * as img  } from '../../../assets/img/';
const ListMenu = (props) => {
    return (
        <Block style={{ margin: 0, marginTop: 20, padding: 0 }}>
            <Row>
                {'item' in props ?
                    props.item.map((item, key) => (
                        <Col width='50' key={key}>
                            <div
                                style={styles.container}
                                onClick={() => item.onClick()}
                            >
                                <div style={styles.badgeContainer}>
                                    <p style={styles.badgeitem}>5</p>
                                </div>
                                <img style={styles.logo} src={require(`../../../assets/img/${item.image}`).default} />
                                <p style={styles.text}>{item.label}</p>
                            </div>
                        </Col>
                    ))
                    :
                    ''}
            </Row>
        </Block>
    )
}

{/* <div
    onClick={(e) => 'onClick' in props ? props.onClick() : {}}
    style={styles.container}>
        <p style={styles.text}>
            {'label' in props ? props.label : 'null'}
        </p>
</div> */}

ListMenu.propTypes = {
    item: PropTypes.array,
    // onClick: PropTypes.func,
    // label: PropTypes.string,
    // image: PropTypes.any,
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',//'#c0392b',
        height: 90,
        borderRadius: 5,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        margin: 0,
        fontSize: 14,
        fontWeight: 'initial',
        color: 'black',//'#fcf5f4',
    },
    logo: {
        width: 50,
        height: 50,
    },
    badgeContainer: {
        display: 'flex',
        position: 'relative',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#c0392b',
        right: -40,
        top: 50,
        justifyContent: 'center',
        alignItems: 'center',
        //  - webkit - box - shadow: 1px - 1px 18px - 6px #000000;
        // box- shadow: 1px - 1px 18px - 6px #000000;
    },
    badgeitem: {
        textAlign: 'center',
        margin: 0,
        fontSize: 14,
        fontWeight: 'initial',
        color: '#fcf5f4',
    }
};

export default ListMenu;