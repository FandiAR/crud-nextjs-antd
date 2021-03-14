import { Button } from 'antd';
import PropTypes from 'prop-types';

const StyledButton = (props) => {
  const {
    text, isClass, isLoading, handleClick,
  } = props;

  return (
    <Button
      htmlType="submit"
      className={isClass}
      loading={isLoading}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};
export default StyledButton;

StyledButton.propTypes = {
  text: PropTypes.string,
  handleClick: PropTypes.func,
  isClass: PropTypes.string,
};

StyledButton.defaultProps = {
  text: 'Button',
  handleClick: () => { },
  isClass: 'default',
};
