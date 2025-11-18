import { memo } from 'react';

const AuditLogs = () => {
  console.log('AuditLogs rendered');
  return (
    <div>
      <h2>AuditLogs</h2>
    </div>
  );
};

export default memo(AuditLogs);