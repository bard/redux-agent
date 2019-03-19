import React from 'react'

// ----------------------------------------------------------------------

interface Props {
  prefix?: string
  suffix?: string
  title: string
}

class DocumentTitle extends React.Component<Props, any> {
  render() {
    document.title = (this.props.prefix || '') +
      this.props.title +
      (this.props.suffix || '')
    return null
  }
}

export default DocumentTitle
