import React, { MouseEvent, ReactNode } from 'react';
import NextLink from 'next/link';

interface CustomLinkProps {
  href: string;
  onClick?: () => void;
  children: ReactNode;
  preventDefault?: boolean | null;
}

const CustomLink = ({href, onClick, children, preventDefault, ...props}:CustomLinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (preventDefault) {
      e.preventDefault();  
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <NextLink className='customLink' href={href} onClick={handleClick} {...props}>
      {children}
    </NextLink>
  );
};

export default CustomLink;
