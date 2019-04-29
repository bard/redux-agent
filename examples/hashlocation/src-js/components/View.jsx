import React from 'react';
import { connect } from 'react-redux';
const View = ({ items, currentItemName, gotoItem }) => (<div>
      <p>Now displaying item: {currentItemName}</p>

      {items.map((_name, index) => <div key={index}>
          <button onClick={() => gotoItem(index)}>
            switch to item {index}
          </button>
          <br />
        </div>)}
    </div>);
const mapStateToProps = (state) => ({
    items: state.items,
    currentItemName: state.items[state.current]
});
const mapDispatchToProps = (dispatch) => ({
    gotoItem(itemIndex) {
        dispatch({
            type: 'GOTO_ITEM',
            payload: itemIndex
        });
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(View);
