import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getTestCases } from '../services/api';

/** @param {{ project: string; handleExit: () => void }} params */
export default function FlowTesting({ project, handleExit }) {
  /** @type {[TestCaseDTO[], Function]} */
  const [cases, setCases] = useState([]);
  const [results, setResults] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadCases = async () => {
      let page = 1;
      const collected = [];
      while (true) {
        const pagination = await getTestCases(project, page);
        collected.push(...pagination.items);
        if (page >= pagination.pages) break;
        page++;
      }
      setCases(collected);
      setLoading(false);
    };

    loadCases();
  }, [project]);

  const handleResult = passed => {
    setResults(prev => ({ ...prev, [cases[currentIndex].id]: passed }));
    if (currentIndex + 1 >= cases.length) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) return <p className='text-center p-8 text-muted-foreground'>Loading test cases...</p>;
  if (finished) return <FinalReport cases={cases} results={results} handleExit={handleExit} />;

  const currentCase = cases[currentIndex];

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>{currentCase.title}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-left'>
          <div>
            <p className='font-medium'>Description:</p>
            <p className='text-muted-foreground'>{currentCase.description}</p>
          </div>
          <ListSection title='Preconditions' list={currentCase.preconditions} />
          <ListSection title='Steps' list={currentCase.steps} />
          <ListSection title='Expected results' list={currentCase.results} />
        </CardContent>
      </Card>

      <div className='flex justify-center gap-4 pt-4'>
        <Button variant='default' className='cursor-pointer' onClick={() => handleResult(true)}>
          Passed
        </Button>
        <Button variant='destructive' className='cursor-pointer' onClick={() => handleResult(false)}>
          Failed
        </Button>
      </div>
    </div>
  );
}

function ListSection({ title, list }) {
  return (
    <div>
      <p className='font-medium'>{title}:</p>
      <NestedList list={list} />
    </div>
  );
}

function NestedList({ list }) {
  return (
    <ul className='list-disc list-inside space-y-1'>
      {list.map((item, idx) =>
        Array.isArray(item) ? (
          <li key={idx}>
            <NestedList list={item} />
          </li>
        ) : (
          <li key={idx}>{item}</li>
        )
      )}
    </ul>
  );
}

/** @param {{ cases: TestCaseDTO[]; results: any; handleExit: () => void }} props */
function FinalReport({ cases, results, handleExit }) {
  return (
    <div className='max-w-2xl mx-auto p-6 space-y-6 text-center'>
      <Card>
        <CardHeader>
          <CardTitle>Test Report</CardTitle>
        </CardHeader>
        <CardContent className='text-left space-y-2'>
          <ul className='space-y-1'>
            {cases.map(testCase => (
              <li
                key={testCase.id}
                className={results[testCase.id] ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}
              >
                {testCase.title} — {results[testCase.id] ? 'Passed' : 'Failed'}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button variant='outline' className='cursor-pointer' onClick={handleExit}>
        Back
      </Button>
    </div>
  );
}

/** @import {TestCaseDTO} from 'just-test-cases'; */
