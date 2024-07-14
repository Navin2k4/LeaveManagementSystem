import React from 'react';
import classNames from 'classnames';
import './StatusDot.scss';

const StatusDot = ({ status, role, showLine,comment }) => {
  return (
    <div className="status-dot-container">
      <div className="tooltip">
        {role.charAt(0).toUpperCase() + role.slice(1)}
        {/* {comment} */}
      </div>
      <div className={classNames('status-dot', status)}>
        <div className="animation"></div>
      </div>
      <div>
      {showLine && <div className={classNames('status-line', status)}></div>}
      </div>
    </div>
  );
};

export default StatusDot;
