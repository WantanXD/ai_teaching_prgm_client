import React, { useRef } from 'react'
import { Button, Link as MuiLink } from "@mui/material/";
import NextLink from 'next/link';

type Props = {
    className? : string;
    link? : string;
    children? : string;
}

const PageButton : React.FC<Props> = ( {className, link="/", children=""}: Props ) => {

  const title = children;
  const pathname = link;

  return (
    <NextLink href={pathname} passHref >
      <Button className="DefaultButton" variant="contained">{title}</Button>
    </NextLink>
  )
}

export default PageButton;