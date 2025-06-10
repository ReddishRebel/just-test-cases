import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Virtuoso } from 'react-virtuoso';
import { getTestCases } from '../services/api';
import { logger } from '../tools/logger';

/**
 * @param {{
 *   project: string;
 *   handleTestCaseEdit: (testCase: TestCaseDTO) => void;
 *   handleTestCaseDelete: (id: string) => void;
 *   handleStart: () => void;
 *   handleCreate: () => void;
 * }} props
 */
export default function TestCaseList({ project, handleTestCaseEdit, handleTestCaseDelete, handleStart, handleCreate }) {
  /** @type {[TestCaseDTO[], Function]} */
  const [cases, setCases] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !project || !hasMore) return;
    setLoading(true);
    try {
      const pagination = await getTestCases(project, page);
      if (page === 1) {
        setCases(pagination.items);
      } else {
        setCases(prev => [...prev, ...pagination.items]);
      }
      setHasMore(pagination.pages > page);
      setPage(prev => prev + 1);
    } catch (error) {
      logger.error('Failed to load more test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCases([]);
    setPage(1);
    setHasMore(true);
    loadMore();
  }, [project]);

  if (!project) {
    return <p className='p-4 text-muted-foreground'>Choose project...</p>;
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4 flex-wrap gap-2'>
        <h3 className='text-xl font-semibold'>{project}</h3>
        <div className='flex gap-2'>
          <Button variant='outline' className='w-24 cursor-pointer' onClick={handleStart}>
            Start
          </Button>
          <Button variant='default' className='w-24 cursor-pointer' onClick={handleCreate}>
            New
          </Button>
        </div>
      </div>

      <div className='border rounded overflow-hidden'>
        <div className='bg-muted p-2 font-medium grid grid-cols-[2fr_4fr_1fr_2fr] gap-4 text-sm'>
          <span>Title</span>
          <span>Description</span>
          <span>Priority</span>
          <span>Actions</span>
        </div>

        <Virtuoso
          style={{ height: '70vh' }}
          data={cases}
          endReached={loadMore}
          itemContent={(index, test) => (
            <div className='grid grid-cols-[2fr_4fr_1fr_2fr] gap-4 border-t p-2 text-sm items-center'>
              <span className='font-semibold'>{test.title}</span>
              <span className='truncate'>{test.description}</span>
              <span className='uppercase text-muted-foreground'>{test.priority}</span>
              <div className='flex gap-2'>
                <Button
                  className='w-24 bg-yellow-400 hover:bg-yellow-500 text-white cursor-pointer'
                  onClick={() => handleTestCaseEdit(test)}
                >
                  Edit
                </Button>
                <Button
                  variant='destructive'
                  className='w-24 cursor-pointer'
                  onClick={() => handleTestCaseDelete(test.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
          components={{
            Footer: () => (loading ? <p className='text-center p-2 text-muted-foreground'>Loading...</p> : null)
          }}
        />
      </div>
    </div>
  );
}

/** @import {TestCaseDTO} from 'just-test-cases'; */
