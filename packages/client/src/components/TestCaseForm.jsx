import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

/**
 * @param {any[]} items
 * @param {Function} setItems
 * @param {number} [level]
 */
const renderNestedListInputs = (items, setItems, level = 0) => {
  const updateItem = (index, value) => {
    const copy = [...items];
    copy[index] = value;
    setItems(copy);
  };

  const addItem = () => setItems([...items, '']);
  const removeItem = index => setItems(items.filter((_, i) => i !== index));

  return (
    <div className={`space-y-2 ml-${level * 4}`}>
      {items.map((item, index) => (
        <div key={index} className='flex items-center gap-2'>
          {Array.isArray(item) ? (
            renderNestedListInputs(item, updated => updateItem(index, updated), level + 1)
          ) : (
            <Input className='flex-1' type='text' value={item} onChange={e => updateItem(index, e.target.value)} />
          )}
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-red-500 px-2 py-1'
            onClick={() => removeItem(index)}
          >
            ✕
          </Button>
        </div>
      ))}
      <Button type='button' variant='link' className='text-blue-600 px-0' onClick={addItem}>
        + Add
      </Button>
    </div>
  );
};

/** @param {TestCaseFormProps} props */
function TestCaseForm({ initialData = {}, handleSubmit, handleCancel }) {
  const [form, setForm] = useState({
    id: initialData.id || '',
    title: initialData.title || '',
    priority: initialData.priority || 'medium',
    description: initialData.description || '',
    preconditions: initialData.preconditions || [],
    steps: initialData.steps || [],
    results: initialData.results || []
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
        <Label htmlFor='id'>ID (unique)</Label>
        <Input name='id' value={form.id} onChange={handleChange} required />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <Input name='title' value={form.title} onChange={handleChange} required />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='priority'>Priority</Label>
        <Select value={form.priority} onValueChange={value => setForm(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue placeholder='Select priority' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='low'>Low</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='high'>High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          name='description'
          value={form.description}
          onChange={handleChange}
          placeholder='Describe the test case...'
        />
      </div>

      <div className='space-y-2'>
        <Label>Preconditions</Label>
        {renderNestedListInputs(form.preconditions, val => setForm(prev => ({ ...prev, preconditions: val })))}
      </div>

      <div className='space-y-2'>
        <Label>Steps</Label>
        {renderNestedListInputs(form.steps, val => setForm(prev => ({ ...prev, steps: val })))}
      </div>

      <div className='space-y-2'>
        <Label>Expected Results</Label>
        {renderNestedListInputs(form.results, val => setForm(prev => ({ ...prev, results: val })))}
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

/** @import {TestCaseDTO} from 'just-test-cases'; */
/**
 * @typedef {Object} TestCaseFormProps
 * @property {Partial<TestCaseDTO>} [initialData]
 * @property {(form: TestCaseDTO) => void} handleSubmit
 * @property {() => void} handleCancel
 */
