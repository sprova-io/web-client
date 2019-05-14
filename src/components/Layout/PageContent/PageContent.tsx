import { PageLoad } from '@/components/Layout';
import React from 'react';
import './PageContent.scss';

interface Props {
  loading?: boolean;
}

const PageContent: React.FunctionComponent<Props> = ({ children, loading }) => {
  return (
    <div className="sprova-page-content">
      {loading ? <PageLoad /> : children}
    </div>
  );
};

export default PageContent;
