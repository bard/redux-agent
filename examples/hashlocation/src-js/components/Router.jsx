import React from 'react';
import { connect } from 'react-redux';
import { HashLocation, Route } from 'redux-agent';
const Router = ({ location, navigatedToItem }) => (<HashLocation enabled={true} location={location}>
      <Route pattern='/item/:index' onMatch={navigatedToItem}/>
    </HashLocation>);
const mapStateToProps = (state) => ({
    location: '/item/' + state.current
});
const mapDispatchToProps = (dispatch) => ({
    navigatedToItem(params) {
        dispatch({
            type: 'GOTO_ITEM',
            payload: params.index
        });
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Router);
