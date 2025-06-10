import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

/** @param {TestCaseFormProps} props */
function TestCaseForm({ handleSubmit, handleCancel }) {
  const [form, setForm] = useState({
    name: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form
      className='p-6 max-w-2xl mx-auto space-y-6 bg-white rounded-xl shadow-md'
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(form);
      }}
    >
      <div className='space-y-2'>
        <Label htmlFor='name'>Name (unique)</Label>
        <Input name='name' value={form.name} onChange={handleChange} required />
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <Button type='button' variant='outline' onClick={handleCancel}>
          Cancel
        </Button>
        <Button type='submit' variant='default'>
          Save
        </Button>
      </div>
    </form>
  );
}

export default TestCaseForm;

/**
 * @typedef {Object} TestCaseFormProps
 * @property {(form: { name: string }) => void} handleSubmit
 * @property {() => void} handleCancel
 */
