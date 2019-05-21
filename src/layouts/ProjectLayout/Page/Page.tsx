import PageLoad from '@/components/PageLoad';
import React from 'react';
import './Page.scss';

interface PageProps {
  loading?: boolean;
}

const Page: React.FunctionComponent<PageProps> = ({
  children,
  loading = false,
}) => {
  return <div className="sprova-page">{loading ? <PageLoad /> : children}</div>;
};

export default Page;
