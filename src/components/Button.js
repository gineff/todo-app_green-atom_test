import Component from '../lib/component.js'

export class Button extends Component {
  template = `<button class="button">
      {{children}}
    </button>`
  getStateFromProps() {
    const { title, children, onClick } = this.props
    this.state = {
      children: title || children,
      onClick,
    }
  }
}
