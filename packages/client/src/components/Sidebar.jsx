import { Button } from '@/components/ui/button';

/**
 * @param {{
 *   projects: string[];
 *   selectedProject: string | null;
 *   handleSelect: (project: string) => void;
 *   handleCreate: () => void;
 * }} props
 */
const Sidebar = ({ projects, selectedProject, handleSelect, handleCreate }) => {
  return (
    <aside className='w-60 bg-muted h-screen border-r p-4 box-border flex flex-col justify-between'>
      <div>
        <h2 className='text-lg font-semibold mb-4'>Projects</h2>
        <ul className='space-y-2'>
          {projects.map(project => (
            <li key={project}>
              <Button
                variant={selectedProject === project ? 'default' : 'outline'}
                className='w-full justify-start cursor-pointer'
                onClick={() => handleSelect(project)}
              >
                {project}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <Button variant='outline' className='mt-4 w-full cursor-pointer' onClick={handleCreate}>
        Add project
      </Button>
    </aside>
  );
};

export default Sidebar;
