import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Typography,
  Card,
  CardBody,
  IconButton
} from '@material-tailwind/react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import useMain from '../../../hooks/useMain';

const ImpactStoryModal = ({
  charity,
  isOpen,
  onClose,
  refreshData,
  notify
}) => {
  const { addImpactStory, updateImpactStory, deleteImpactStory } = useMain();
  const [loading, setLoading] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [impactStories, setImpactStories] = useState(
    charity?.impactStories || []
  );

  // const impactStories = charity?.impactStories || [];

  useEffect(() => {
    if (editingStory) {
      setFormData({
        title: editingStory.title || '',
        description: editingStory.description || ''
      });
      setShowForm(true);
    } else {
      setFormData({
        title: '',
        description: ''
      });
    }
  }, [editingStory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      notify('error', 'Impact story title is required');
      return;
    }

    if (!formData.description.trim()) {
      notify('error', 'Impact story description is required');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (editingStory) {
        res = await updateImpactStory({
          charityId: charity._id,
          storyId: editingStory._id,
          ...formData
        });
      } else {
        res = await addImpactStory({
          charityId: charity._id,
          ...formData
        });
      }

      if (res.status) {
        if (editingStory) {
          let temp = [...impactStories];
          const index = temp.findIndex(
            (story) => story._id === editingStory._id
          );
          temp[index] = {
            ...temp[index],
            ...formData
          };
          setImpactStories(temp);
        }

        notify(
          'success',
          editingStory
            ? 'Impact story updated successfully'
            : 'Impact story added successfully'
        );
        refreshData();
        handleCancelForm();
      } else {
        notify('error', res.message || 'Failed to save impact story');
      }
    } catch (error) {
      console.error('Error saving impact story:', error);
      notify('error', 'An error occurred while saving impact story');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this impact story?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await deleteImpactStory(charity._id, storyId);
      if (res.status) {
        setImpactStories((prev) =>
          prev.filter((story) => story._id !== storyId)
        );
        notify('success', 'Impact story deleted successfully');
        refreshData();
      } else {
        notify('error', res.message || 'Failed to delete impact story');
      }
    } catch (error) {
      console.error('Error deleting impact story:', error);
      notify('error', 'An error occurred while deleting impact story');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStory(null);
    setFormData({
      title: '',
      description: ''
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="lg"
      className="max-h-screen overflow-y-auto"
    >
      <DialogHeader>
        <Typography variant="h4">Impact Stories - {charity?.name}</Typography>
      </DialogHeader>

      <DialogBody divider className="space-y-4">
        {/* Add New Story Button */}
        {!showForm && (
          <div className="flex justify-end">
            <Button
              color="green"
              size="sm"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Impact Story
            </Button>
          </div>
        )}

        {/* Form for adding/editing */}
        {showForm && (
          <Card className="mb-4">
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Typography variant="h6">
                  {editingStory ? 'Edit Impact Story' : 'Add New Impact Story'}
                </Typography>

                <div>
                  <Typography variant="small" className="mb-2 font-medium">
                    Title *
                  </Typography>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter impact story title"
                    required
                  />
                </div>

                <div>
                  <Typography variant="small" className="mb-2 font-medium">
                    Description *
                  </Typography>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter impact story description"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="text"
                    onClick={handleCancelForm}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="green" disabled={loading}>
                    {loading ? 'Saving...' : editingStory ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Impact Stories List */}
        <div className="space-y-4">
          {impactStories.length === 0 ? (
            <Typography
              variant="body1"
              className="text-center text-gray-500 py-8"
            >
              No impact stories found. Add one to get started.
            </Typography>
          ) : (
            impactStories.map((story) => (
              <Card key={story._id} className="border">
                <CardBody>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Typography variant="h6" className="mb-2">
                        {story.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-600 mb-2"
                      >
                        {story.description}
                      </Typography>
                      <Typography variant="small" className="text-gray-500">
                        Added on: {formatDate(story.date)}
                      </Typography>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <IconButton
                        size="sm"
                        color="blue"
                        variant="text"
                        onClick={() => handleEdit(story)}
                        disabled={loading}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        size="sm"
                        color="red"
                        variant="text"
                        onClick={() => handleDelete(story._id)}
                        disabled={loading}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ImpactStoryModal;
