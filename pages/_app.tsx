import { Provider } from 'react-redux'
import { ThemeProvider, GlobalStyles } from '@space-metaverse-ag/space-ui'
import type { AppProps } from 'next/app'
import { store } from 'redux/store'
import * as snippet from '@segment/snippet'
import Script from 'next/script'

const analytics = () => {
  const options = {
    page: false,
    apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
  }

  if (process.env.NODE_ENV === 'development') return snippet.max(options)

  return snippet.min(options)
}

const App = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <Script
      id="segment-script"
      dangerouslySetInnerHTML={{ __html: analytics() }}
    />

    <ThemeProvider>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  </Provider>
)

export default App
