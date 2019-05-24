import _ from 'lodash';
import React, { useState } from 'react';

interface LayoutContext {
  setSubTitle: (subTitle: string | null) => void;
  setTitle: (subTitle: string | null) => void;
  subTitle?: string | null;
  title?: string | null;
}

const initialContext: LayoutContext = {
  setSubTitle: () => {},
  setTitle: () => {},
  subTitle: null,
  title: null,
};

const LayoutContext = React.createContext<LayoutContext>(initialContext);

const LayoutProvider: React.FunctionComponent = ({ children }) => {
  const [subTitle, setSubTitle] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  return (
    <LayoutContext.Provider
      value={{
        setSubTitle,
        setTitle,
        subTitle,
        title,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutProvider, LayoutContext };
