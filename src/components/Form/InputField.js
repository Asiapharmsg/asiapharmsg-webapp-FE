import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = ({
  id,
  name,
  type,
  value,
  required,
  field,
  errorMsg,
  ...rest
}) => {
  if (type === 'radio') {
    return (
      <div className="input-field">
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          {...rest}
        />
        <label htmlFor={id} className="pl-2 mr-5">
          {field}
        </label>
      </div>
    );
  } else if (type === 'password') {
    const [isShow, setIsShow] = useState(false);
    const [inputType, setInputType] = useState('password');

    const handleTogglePassword = () => {
      setInputType(!isShow ? 'text' : 'password');
      setIsShow(!isShow);
    };

    return (
      <div
        className={`input-field ${
          field ? 'input-password' : 'input-password-no-label'
        }`}
      >
        {field && (
          <label htmlFor={id}>
            {field}
            {required && <span className="required">*</span>}
          </label>
        )}
        <input
          type={inputType}
          id={id}
          name={name}
          required={required}
          value={value}
          {...rest}
        />
        <a className="btnShow">
          {isShow ? (
            <FaEyeSlash onClick={handleTogglePassword} />
          ) : (
            <FaEye onClick={handleTogglePassword} />
          )}
        </a>
        {errorMsg !== '' ? <span className="error-msg">{errorMsg}</span> : ''}
      </div>
    );
  } else {
    return (
      <div className="input-field">
        {field && (
          <label htmlFor={id}>
            {field}
            {required && <span className="required">*</span>}
          </label>
        )}
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          {...rest}
        />
        {errorMsg !== '' ? <span className="error-msg">{errorMsg}</span> : ''}
      </div>
    );
  }
};

InputField.defaultProps = {
  type: 'text',
  value: '',
  required: true,
  errorMsg: ''
};

InputField.propType = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string || PropTypes.number,
  field: PropTypes.string,
  required: PropTypes.bool
};

export default InputField;
