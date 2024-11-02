import clsx from 'clsx';
import * as React from 'react';
import { Tooltip as TippyTooltip } from 'react-tippy';

type TooltipTextProps = {
  tipChildren?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  spanClassName?: string;
  withUnderline?: boolean;
} & React.ComponentPropsWithoutRef<typeof TippyTooltip>;

export default function Tooltip({
  tipChildren,
  children,
  className,
  spanClassName,
  withUnderline = false,
  ...rest
}: TooltipTextProps) {
  return (
    <TippyTooltip
      trigger='mouseenter'
      interactive
      html={<div className={clsx(className)}>{tipChildren}</div>}
      {...rest}
    >
      {withUnderline ? (
        <span className={clsx(spanClassName, 'underline')}>
          {children}
        </span>
      ) : (
        children
      )}
    </TippyTooltip>
  );
}
