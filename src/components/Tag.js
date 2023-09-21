/* eslint-disable no-unused-vars */
import Component from '../lib/component.js'

export class Tag extends Component {
  getStateFromProps() {
    const { key, children, className, handleTagSelect } = this.props
    const handleClick = _ => handleTagSelect.call(null, key)
    this.state = { children, className, onClick: handleClick }
  }
  render() {
    const { className } = this.state
    return `<span class="tag ${className}">
    {{children}}
  </span>`
  }
}
