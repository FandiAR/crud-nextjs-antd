import Head from 'next/head';
import EntryLayout from '../components/Layout/EntryLayout';
import LoginContainer from '../containers/LoginContainer';

const LoginPage = () => (
  <EntryLayout>
    <Head>
      <title>CrudNextJs | Login</title>
    </Head>
    <LoginContainer />
  </EntryLayout>
);

export default LoginPage;
