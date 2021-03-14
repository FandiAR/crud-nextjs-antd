import { useEffect } from 'react';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/_app.scss';

const PlanetWhim = ({ Component, pageProps }) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <div className="body">
      <Head>
        <title>CrudNextJs</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
};

export default PlanetWhim;
