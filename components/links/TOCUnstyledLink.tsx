import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';

export type UnstyledLinkProps = {
  children: React.ReactNode;
  className?: string;
  level:number;
  minLevel:number;
}& React.ComponentPropsWithoutRef<'a'>

export default function TOCUnstyledLink({
  children,
  className,
  level,
  minLevel,
  ...rest
}: UnstyledLinkProps) {
 
  return (
    <span
      rel='noopener noreferrer'
      {...rest}
      style={{ marginLeft: (level - minLevel) * 16 }}
      className={clsx(className, 'cursor-newtab')}
    >
      {children}
    </span>
  );
}
