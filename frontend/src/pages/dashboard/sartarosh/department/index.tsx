import { memo } from 'react';
import Profile from '../../../profile';

const Department = () => {
  return (
    <div className='bg-[#14151F] p-[24px] rounded-[8px]'>
      <Profile/>
    </div>
  );
};

export default memo(Department);