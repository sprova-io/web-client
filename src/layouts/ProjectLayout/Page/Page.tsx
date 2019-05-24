import PageLoad from '@/components/PageLoad';
import React from 'react';
import './Page.scss';

interface PageProps {
  loading?: boolean;
  subTitle?: string;
  title?: string;
}

const Page: React.FunctionComponent<PageProps> = ({
  children,
  loading = false,
  subTitle,
  title,
}) => {
  return <div className="sprova-page">{loading ? <PageLoad /> : children}</div>;
};

export default Page;
