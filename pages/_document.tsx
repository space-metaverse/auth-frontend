import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext
  } from 'next/document'
  import { ServerStyleSheet } from 'styled-components'
  
  export default class MyDocument extends Document {
    // eslint-disable-next-line
    static async getInitialProps (ctx: DocumentContext) {
      const sheet = new ServerStyleSheet()
      const originalRenderPage = ctx.renderPage
  
      try {
        ctx.renderPage = () =>
          originalRenderPage({
            enhanceApp: (App) => (props) =>
              sheet.collectStyles(<App {...props} />)
          })
  
        const initialProps = await Document.getInitialProps(ctx)
  
        return {
          ...initialProps,
          styles: [initialProps.styles, sheet.getStyleElement()]
        }
      } finally {
        sheet.seal()
      }
    }
  
    // eslint-disable-next-line
    render () {
      return (
        <Html lang="pt-BR">
          <Head>
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <body style={{ margin: 0 }}>
            <Main />
  
            <NextScript />
          </body>
        </Html>
      )
    }
  }
  