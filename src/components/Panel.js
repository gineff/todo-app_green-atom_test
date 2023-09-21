/* eslint-disable no-unused-vars */
import Component from '../lib/component.js'

export class Panel extends Component {
  constructor(props) {
    super(props)
    this.refs.odd = this.element.querySelector('.odd')
    this.refs.even = this.element.querySelector('.even')
    this.refs.first = this.element.querySelector('.first')
    this.refs.last = this.element.querySelector('.last')
  }
  getStateFromProps() {
    const { toggleEvenRows, toggleOddRows, removeFirst, removeLast } =
      this.props
    const handleClick = e => {
      if (e.target === this.refs.odd) {
        toggleOddRows()
      } else if (e.target === this.refs.even) {
        toggleEvenRows()
      } else if (e.target === this.refs.last) {
        removeLast()
      } else if (e.target === this.refs.first) {
        removeFirst()
      }
    }
    this.setState({ onClick: handleClick })
  }
  render() {
    return `<div class="panel-wrapper">
      <div class="todo-app__panel panel">
        <div class="tag odd">mark odd</div>
        <div class="tag even">mark even</div>
        <div class="tag first">remove first</div>
        <div class="tag last">remove last</div>
      </div>
    </div>`
  }
}
