import Head from 'next/head';
import RegisterContainer from '../containers/RegisterContainer';
import EntryLayout from '../components/Layout/EntryLayout';

const RegisterPage = () => (
  <EntryLayout>
    <Head>
      <title>CrudNextJs | Register</title>
    </Head>
    <RegisterContainer />
  </EntryLayout>
);

export default RegisterPage;
