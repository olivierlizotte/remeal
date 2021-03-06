import { h, Component } from 'preact'
import styled from 'preact-emotion'
import { parseUrl } from '../utils/parseUrl'
import { PresentationPointer } from './PresentationPointer'

const Iframe = styled.iframe`
  height: 100%;
  width: 100%;
  border: none;
`

const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
`

export class PresentationFrame extends Component {
  shouldComponentUpdate({ url }) {
    const { host, pathname } = parseUrl(url)
    const { host: oldHost, pathname: oldPath } = parseUrl(this.props.url)

    return host + pathname !== oldHost + oldPath
  }

  setIframeRef = (element) => {
    if (element) {
      element.onload = () => {
        this.iframe = element.contentWindow
        this.sendState(this.props.state)
      }
    } else {
      this.iframe = null
    }
  }

  sendState(state) {
    this.iframe &&
      this.iframe.postMessage(
        JSON.stringify({ method: 'setState', args: [state] }),
        '*'
      )
  }

  componentWillReceiveProps({ state }) {
    this.sendState(state)
  }

  render() {
    return (
      <Container>
        <Iframe innerRef={this.setIframeRef} src={this.props.url} />
        <PresentationPointer enablePointer={this.props.enablePointer} />
      </Container>
    )
  }
}
