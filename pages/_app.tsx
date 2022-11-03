import { Provider } from 'react-redux'
import { ThemeProvider, GlobalStyles } from '@space-metaverse-ag/space-ui'
import type { AppProps } from 'next/app'
import { store } from 'redux/store'

const App = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <ThemeProvider>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  </Provider>
)

export default App
