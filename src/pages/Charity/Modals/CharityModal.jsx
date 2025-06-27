import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Typography,
  Spinner
} from '@material-tailwind/react';
import useMain from '../../../hooks/useMain';

const CharityModal = ({ charity, isOpen, onClose, refreshData, notify }) => {
  const { createCharity, updateCharity, getContests } = useMain();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    if (charity) {
      console.log(charity);
      setFormData({
        name: charity.name || '',
        description: charity.description || '',
        category: charity.category?._id || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: ''
      });
    }
  }, [charity]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await getContests();
      if (res.status && res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      notify('error', 'Charity name is required');
      return;
    }

    if (!formData.description.trim()) {
      notify('error', 'Description is required');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (charity) {
        res = await updateCharity({
          id: charity._id,
          ...formData
        });
      } else {
        res = await createCharity(formData);
      }

      if (res.status) {
        notify(
          'success',
          charity
            ? 'Charity updated successfully'
            : 'Charity created successfully'
        );
        refreshData();
        onClose();
      } else {
        notify('error', res.message || 'Failed to save charity');
      }
    } catch (error) {
      console.error('Error saving charity:', error);
      notify('error', 'An error occurred while saving charity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="md"
      className="max-h-screen overflow-y-auto"
    >
      <DialogHeader>
        <Typography variant="h4">
          {charity ? 'Edit Charity' : 'Create New Charity'}
        </Typography>
      </DialogHeader>

      {loadingCategories ? (
        <div className="flex justify-center items-center h-72">
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <DialogBody divider className="space-y-4">
            <div>
              <Typography variant="h6" className="mb-2">
                Charity Name *
              </Typography>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter charity name"
                required
              />
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Category
              </Typography>
              <Select
                value={formData.category}
                onChange={handleSelectChange}
                label="Select Category"
              >
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.title}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Description *
              </Typography>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter charity description"
                rows={6}
                required
              />
            </div>
          </DialogBody>

          <DialogFooter className="space-x-2">
            <Button variant="text" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" color="green" disabled={loading}>
              {loading ? 'Saving...' : charity ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
};

export default CharityModal;
