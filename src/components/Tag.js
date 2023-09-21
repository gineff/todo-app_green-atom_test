/* eslint-disable no-unused-vars */
import Component from '../lib/component.js'

export class Tag extends Component {
  getStateFromProps() {
    const { children, className, handleTagSelect } = this.props
    const handleClick = _ => handleTagSelect.call(null, children)
    this.state = { children, className, onClick: handleClick }
  }
  render() {
    const { className } = this.state
    return `<li class="tag ${className}">
    {{children}}
  </li>`
  }
}
