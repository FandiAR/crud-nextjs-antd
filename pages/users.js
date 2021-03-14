import Head from 'next/head';
import UsersContainer from '../containers/UsersContainer';

const UsersPage = () => (
  <>
    <Head>
      <title>CrudNextJs | Users</title>
    </Head>
    <UsersContainer />
  </>
);

export default UsersPage;
