import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import EditChallengeModal from './Modals/EditChallengeModal';
import useMain from '@/hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography, Select, Option, Input, Chip } from '@material-tailwind/react';

const getCategoryColor = (category) => {
  switch (category) {
    case 'UPLOAD': return 'blue';
    case 'ENGAGEMENT': return 'green';
    case 'SOCIAL': return 'indigo';
    case 'CONTEST': return 'amber';
    default: return 'gray';
  }
};
const getTypeColor = (type) => {
  switch (type) {
    case 'DAILY': return 'blue';
    case 'WEEKLY': return 'green';
    case 'MONTHLY': return 'purple';
    case 'ACHIEVEMENT': return 'amber';
    default: return 'gray';
  }
};
const getRequirementTypeDisplay = (requirementType) => {
  switch (requirementType) {
    case 'UPLOAD_VIDEO': return 'Upload Videos';
    case 'WATCH_VIDEOS': return 'Watch Videos';
    case 'GAIN_FOLLOWERS': return 'Gain Followers';
    case 'WIN_CONTEST': return 'Win Contest';
    case 'GET_LIKES': return 'Get Likes';
    case 'COMMENT': return 'Comment';
    default: return requirementType;
  }
};

const Challenges = ({ notify }) => {
  const { getChallenges } = useMain();

  const [data, setData] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    status: '',
    query: '',
    type: '',
    category: ''
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  const columns = [
    {
      name: 'Title',
      selector: row => (
        <div>
          <Typography variant="small" className="font-medium">
            {row.title}
          </Typography>
          <Typography variant="small" className="text-xs text-blue-gray-500">
            {row.description.substring(0, 50)}...
          </Typography>
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Type',
      selector: row => (
        <Chip
          value={row.type}
          color={getTypeColor(row.type)}
          size="sm"
        />
      ),
      sortable: true,
    },
    {
      name: 'Category',
      selector: row => (
        <Chip
          value={row.category}
          color={getCategoryColor(row.category)}
          size="sm"
        />
      ),
      sortable: true,
    },
    {
      name: 'Requirement',
      selector: row => (
        <div>
          <Typography variant="small" className="font-medium">
            {getRequirementTypeDisplay(row.requirement.type)}
          </Typography>
          <Typography variant="small" className="text-xs text-blue-gray-500">
            Count: {row.requirement.count}
          </Typography>
        </div>
      ),
    },
    {
      name: 'Reward',
      selector: row => (
        <div>
          <Typography variant="small" className="font-medium">
            Star Points
          </Typography>
          <Typography variant="small" className="text-xs text-blue-gray-500">
            Amount: {row.reward.amount}
          </Typography>
        </div>
      ),
    },
    {
      name: 'Status',
      selector: row => (
        <Chip
          value={row.isActive ? "Active" : "Inactive"}
          color={row.isActive ? "green" : "red"}
          size="sm"
        />
      ),
      sortable: true,
    },
    {
      name: "Actions",
      selector: row => (
        <div className="flex justify-center">
          <div
            onClick={() => {
              setSelectedChallenge(row);
              document.getElementById('editChallengeModal').classList.toggle('hidden');
            }}
            className='mr-2 cursor-pointer'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="update-icon bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
            </svg>
          </div>
        </div>
      ),
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    try {
      const res = await getChallenges(value.status || true, page, perPage);
      if (res && res.status) {
        setData(res.data);
        setTotalRows(res.totalCount);
      } else {
        notify('error', 'Failed to fetch challenges');
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      notify('error', 'An error occurred while fetching challenges');
    }
    setLoadFlag(false);
  };
  const handleChange = (e, name = '') => {
    if (name === '') {
      setValue({ ...value, [e.target.name]: e.target.value });
    } else {
      setValue({ ...value, [name]: e });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage(1);
    getData();
  };
  const handlePageChange = (page) => {
    setPage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  return (
    <>
      <EditChallengeModal
        data={selectedChallenge}
        setRefreshFlag={setRefreshFlag}
        refreshFlag={refreshFlag}
        notify={notify}
      />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Manage Challenges
            </Typography>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {/* <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div>
              <div className="flex items-center mx-2">
                <Select label="Type" onChange={(e) => handleChange(e, 'type')}>
                  <Option value="">All Types</Option>
                  <Option value="DAILY">Daily</Option>
                  <Option value="WEEKLY">Weekly</Option>
                  <Option value="MONTHLY">Monthly</Option>
                  <Option value="ACHIEVEMENT">Achievement</Option>
                </Select>
              </div>
              <div className="flex items-center mx-2">
                <Select label="Category" onChange={(e) => handleChange(e, 'category')}>
                  <Option value="">All Categories</Option>
                  <Option value="UPLOAD">Upload</Option>
                  <Option value="ENGAGEMENT">Engagement</Option>
                  <Option value="SOCIAL">Social</Option>
                  <Option value="CONTEST">Contest</Option>
                </Select>
              </div>
              <div className="flex items-center mx-2">
                <Select label="Status" onChange={(e) => handleChange(e, 'status')}>
                  <Option value="">All Statuses</Option>
                  <Option value="true">Active</Option>
                  <Option value="false">Inactive</Option>
                </Select>
              </div>
              <Button type='submit' size='sm' className='ml-3'>Filter</Button>
            </form> */}

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Challenges"
              progressPending={loadFlag}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Challenges; 