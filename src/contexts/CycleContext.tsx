import { getCycles } from '@/api/cycle.api';
import { findById } from '@/utils';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { Cycle } from 'sprova-types';
import { ProjectContext } from './ProjectContext';

const CURRENT_CYCLE_ID = 'currentCycleId';

interface CycleContext {
  currentCycle: Cycle | null;
  error: string | null;
  isCyclesFetched: boolean;
  onSelectCycle: (cycle: Cycle) => void;
  onRemoveCycle: (cycle: Cycle) => void;
  onAddCycle: (cycle: Cycle) => void;
  cycles: Cycle[];
}

const initialContext: CycleContext = {
  currentCycle: null,
  error: null,
  isCyclesFetched: false,
  onAddCycle: () => {},
  onRemoveCycle: () => {},
  onSelectCycle: () => {},
  cycles: [],
};

const CycleContext = React.createContext<CycleContext>(initialContext);

const CycleProvider: React.FunctionComponent = ({ children }) => {
  const { currentProject } = useContext(ProjectContext);

  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCyclesFetched, setIsCyclesFetched] = useState<boolean>(false);
  const [cycles, setCycles] = useState<Cycle[]>([]);

  useEffect(() => {
    if (!currentProject) {
      setIsCyclesFetched(true);
      return;
    }

    const fetchCycles = async () => {
      setIsCyclesFetched(false);
      setError('');

      try {
        const fetchedCycles = await getCycles(currentProject._id);
        setCycles(fetchedCycles);

        const _currentCycle = findCurrentCycle(fetchedCycles);
        setCurrentCycle(_currentCycle);
      } catch (error) {
        setError(error);
      } finally {
        setIsCyclesFetched(true);
      }
    };

    fetchCycles();
  }, [currentProject]);

  const findCurrentCycle = (_cycles: Cycle[]): Cycle | null => {
    if (!_cycles || _cycles.length === 0) {
      return null;
    }
    const firstCycle = _cycles[0];
    const currentCycleId = localStorage.getItem(CURRENT_CYCLE_ID);
    return currentCycleId
      ? findById(_cycles, currentCycleId) || firstCycle
      : firstCycle;
  };

  const handleAddCycle = (cycle: Cycle) => {
    setCycles([...cycles, cycle]);
  };

  const handleRemoveCycle = (cycle: Cycle) => {
    setCycles(_.without(cycles, cycle));
  };

  const handleSelectCycle = (cycle: Cycle) => {
    localStorage.setItem(CURRENT_CYCLE_ID, cycle._id);
    setCurrentCycle(cycle);
  };

  return (
    <CycleContext.Provider
      value={{
        currentCycle,
        error,
        isCyclesFetched,
        onAddCycle: handleAddCycle,
        onRemoveCycle: handleRemoveCycle,
        onSelectCycle: handleSelectCycle,
        cycles,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
};

export { CycleProvider, CycleContext };
