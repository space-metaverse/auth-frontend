import type { AppProps } from 'next/app';
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ThemeProvider, GlobalStyles } from '@space-metaverse-ag/space-ui';

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
