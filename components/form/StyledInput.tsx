import clsx from 'clsx';
import * as React from 'react';

export default function StyledInput({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      className={clsx(
        className,
        'w-full p-2 rounded-md dark:bg-dark',
        'border border-gray-300 dark:border-gray-600', // Giữ border với màu mặc định
        'focus:border-[#E068CE] focus:outline-none focus:ring-1', // Áp dụng màu rgb cho border khi focus
        'dark:focus:border-[#E068CE]', // Áp dụng màu rgb cho border khi focus trong chế độ dark
        'transition-colors duration-500' // Thêm hiệu ứng chuyển màu với thời gian 0.2 giây
      )}
      {...rest}
    />
  );
}
