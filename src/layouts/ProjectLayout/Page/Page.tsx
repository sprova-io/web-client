import PageLoad from '@/components/PageLoad';
import { LayoutContext } from '@/layouts/ProjectLayout/LayoutContext';
import React, { useContext, useEffect } from 'react';
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
  const { setSubTitle, setTitle } = useContext(LayoutContext);

  useEffect(() => {
    setSubTitle(subTitle || null);
  }, [subTitle]);

  useEffect(() => {
    setTitle(title || null);
  }, [title]);

  return (
    <div className="sprova-project-page">
      {loading ? <PageLoad /> : children}
    </div>
  );
};

export default Page;
