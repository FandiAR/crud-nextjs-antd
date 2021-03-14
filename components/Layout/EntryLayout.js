import { Row, Col } from 'antd';
import { Title } from '../Text';

const EntryLayout = ({ children }) => (
  <div className="guest">
    <Row className="guest__container">
      <Col span={12} className="left">
        <Title className="text-left text-white" level={2}>
          CrudReactJs
        </Title>
        <div className="text-center text-welcome">
          <Title level={1} className="text-white">Welcome...!</Title>
          <Title level={3} className="text-white">At simple web apps CrudReactJs</Title>
        </div>
      </Col>
      <Col span={12} className="right">
        <main>{children}</main>
      </Col>
    </Row>
  </div>
);
export default EntryLayout;
