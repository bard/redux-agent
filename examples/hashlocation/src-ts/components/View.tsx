import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { State } from '../types'

interface StateProps {
  items: string[]
  currentItemName: string
}

interface DispatchProps {
  gotoItem(itemIndex: number): void
}

type Props = StateProps & DispatchProps

const View: React.FunctionComponent<Props> = (
  { items, currentItemName, gotoItem }
) => (
    <div>
      <p>Now displaying item: {currentItemName}</p>

      {items.map((_name, index) =>
        <div key={index}>
          <button onClick={() => gotoItem(index)}>
            switch to item {index}
          </button>
          <br />
        </div>)}
    </div>
  )

const mapStateToProps = (state: State): StateProps => ({
  items: state.items,
  currentItemName: state.items[state.current]
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  gotoItem(itemIndex: number) {
    dispatch({
      type: 'GOTO_ITEM',
      payload: itemIndex
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
