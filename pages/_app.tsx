import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Theme, GlobalStyles } from '@space-metaverse-ag/space-ui/styledTheme';

function App({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
    <ThemeProvider theme={Theme}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  </Provider>
}

export default App
