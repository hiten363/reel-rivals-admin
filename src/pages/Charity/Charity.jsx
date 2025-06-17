import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography
} from '@material-tailwind/react';
import { Select, Option } from '@material-tailwind/react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import useMain from '../../hooks/useMain';
import VerifyCharityModal from './Modals/VerifyCharityModal';
import CharityModal from './Modals/CharityModal';
import ImpactStoryModal from './Modals/ImpactStoryModal';

const Charity = ({ notify }) => {
  const { getCharities, deleteCharity } = useMain();

  const [data, setData] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    verified: ''
  });
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCharityModal, setShowCharityModal] = useState(false);
  const [showImpactStoryModal, setShowImpactStoryModal] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  const columns = useMemo(
    () => [
      {
        name: 'Charity Name',
        selector: (row) => row.name,
        sortable: true,
        wrap: true
      },
      {
        name: 'Category',
        selector: (row) => row.category?.title || 'N/A',
        sortable: true,
        wrap: true
      },
      {
        name: 'Total Donations',
        selector: (row) => `$${row.totalDonations?.toFixed(2) || '0.00'}`,
        sortable: true,
        wrap: true
      },
      {
        name: 'Donor Count',
        selector: (row) => row.donorCount || 0,
        sortable: true,
        wrap: true
      },
      {
        name: 'Impact Stories',
        selector: (row) => row.impactStories?.length || 0,
        sortable: true,
        wrap: true
      },
      {
        name: 'Created By',
        selector: (row) => row.createdBy?.userName || 'Unknown',
        sortable: true,
        wrap: true
      },
      {
        name: 'Verified',
        selector: (row) => (
          <span
            className={`font-semibold ${
              row.verified ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {row.verified ? 'Yes' : 'No'}
          </span>
        ),
        sortable: true
      },
      {
        name: 'Actions',
        selector: (row) => (
          <div className="flex justify-center gap-1">
            <Button
              size="sm"
              color="blue"
              variant="outlined"
              onClick={() => handleEdit(row)}
              className="p-2"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              color="purple"
              variant="outlined"
              onClick={() => handleImpactStories(row)}
              className="p-2"
            >
              <BookOpenIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              color={row.verified ? 'red' : 'green'}
              variant="outlined"
              onClick={() => handleVerify(row)}
              className="p-2"
            >
              {row.verified ? 'Unverify' : 'Verify'}
            </Button>
            <Button
              size="sm"
              color="red"
              variant="outlined"
              onClick={() => handleDelete(row)}
              className="p-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ),
        width: '250px'
      }
    ],
    []
  );

  const getData = async () => {
    setLoading(true);
    try {
      const res = await getCharities('', value.verified, page, perPage);

      if (res.status) {
        setData(res.data);
        setTotalRows(res.pagination.total);
      } else {
        notify('error', res.message || 'Failed to fetch charities');
      }
    } catch (error) {
      console.error('Error fetching charities:', error);
      notify('error', 'An error occurred while fetching charities');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, name = '') => {
    const { value: inputValue, name: inputName } = e.target;
    setValue({
      ...value,
      [name || inputName]: inputValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage(1);
    setRefreshFlag(!refreshFlag);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  const handleCreate = () => {
    setEditingCharity(null);
    setShowCharityModal(true);
  };

  const handleEdit = (charity) => {
    setEditingCharity(charity);
    setShowCharityModal(true);
  };

  const handleDelete = async (charity) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${charity.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await deleteCharity(charity._id);
      if (res.status) {
        notify('success', 'Charity deleted successfully');
        setRefreshFlag(!refreshFlag);
      } else {
        notify('error', res.message || 'Failed to delete charity');
      }
    } catch (error) {
      console.error('Error deleting charity:', error);
      notify('error', 'An error occurred while deleting charity');
    }
  };

  const handleVerify = (charity) => {
    setSelectedCharity(charity);
    setShowVerifyModal(true);
  };

  const handleImpactStories = (charity) => {
    setSelectedCharity(charity);
    setShowImpactStoryModal(true);
  };

  const refreshData = () => {
    setRefreshFlag(!refreshFlag);
  };

  const closeModals = () => {
    setShowVerifyModal(false);
    setShowCharityModal(false);
    setShowImpactStoryModal(false);
    setSelectedCharity(null);
    setEditingCharity(null);
  };

  return (
    <>
      {/* Verify Charity Modal */}
      {showVerifyModal && selectedCharity && (
        <VerifyCharityModal
          charity={selectedCharity}
          setSelectedCharity={setSelectedCharity}
          refreshData={refreshData}
          notify={notify}
          onClose={closeModals}
        />
      )}

      {/* Charity Create/Edit Modal */}
      <CharityModal
        charity={editingCharity}
        isOpen={showCharityModal}
        onClose={closeModals}
        refreshData={refreshData}
        notify={notify}
      />

      {/* Impact Story Modal */}
      {showImpactStoryModal && selectedCharity && (
        <ImpactStoryModal
          charity={selectedCharity}
          isOpen={showImpactStoryModal}
          onClose={closeModals}
          refreshData={refreshData}
          notify={notify}
        />
      )}

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Charities
              </Typography>
              <Button
                color="white"
                size="sm"
                onClick={handleCreate}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Create Charity
              </Button>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form onSubmit={handleSubmit}>
              <div className="max-w-full p-4 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-end gap-3">
                  <div>
                    <Select
                      label="Verified Status"
                      name="verified"
                      value={value.verified}
                      onChange={(val) =>
                        handleChange(
                          { target: { name: 'verified', value: val } },
                          'verified'
                        )
                      }
                    >
                      <Option value="">All</Option>
                      <Option value="true">Verified</Option>
                      <Option value="false">Not Verified</Option>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" color="blue" ripple={true}>
                      Filter
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              highlightOnHover
              pointerOnHover
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Charity;
