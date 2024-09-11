import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import AddStatisticsModal from './Modals/AddStatisticsModal';
import EditStatisticsModal from './Modals/EditStatisticsModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";

const Statistics = ({ notify }) => {
  const { getStatisticss, deleteStatistics, undoStatistics } = useMain();
  // console.log('yes');

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [id, setId] = useState(0);
  const [msg, setMsg] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    status: '',
    query: ''
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
      name: 'People Impacted',
      selector: row => row.count1,
      sortable: true
    },
    {
      name: 'Revenue Generated',
      selector: row => row.count2,
      sortable: true
    },
    {
      name: 'Total Volunteer Joined',
      selector: row => row.count3,
      sortable: true
    },
    {
      name: 'Total Projects & Program Reach',
      selector: row => row.count4,
      sortable: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <div onClick={() => {
          setData1(row);
          document.getElementById('editStatisticsModal').classList.toggle('hidden');
        }} className='mr-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="update-icon bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
          </svg>
        </div>
      </div>,
      grow: 0.1
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getStatisticss(value.status, value.query, page, perPage);
    console.log(ans);
    setData(ans.data);
    setTotalRows(ans.count);
    setLoadFlag(false);
  };

  const handleDelete = async () => {
    console.log(id);
    const ans = await deleteStatistics(id);

    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('deleteModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  const handleChange = (e, name = '') => {
    if (name === '') {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
    else {
      setValue({ ...value, [name]: e });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(value);
    const ans = await getStatisticss(value.status, value.query, 1, perPage);
    setTotalRows(ans.count);
    setPage(1);
    console.log(ans);
    setData(ans.data);
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
      <AddStatisticsModal setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <EditStatisticsModal data={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      {/* <DeleteModal msg={msg} handleDelete={handleDelete} /> */}

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">Manage Statistics</Typography>

              {data.length === 0 && <Button color="red" onClick={() => {
                document.getElementById('addStatisticsModal').classList.toggle('hidden');
              }} children="Add Statistics +">Add Statistics +</Button>}
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {/* <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div>
              <div className="flex items-center">
                <Select label="Status" children={<p>Status</p>} onChange={(e) => {
                  handleChange(e, 'status');
                }}>
                  <Option value="" children={<p>Select Status</p>}>Select Status</Option>
                  <Option value="true" children={<p>Active</p>}>Active</Option>
                  <Option value="false" children={<p>Deleted</p>}>Deleted</Option>
                </Select>
              </div>
              <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
            </form> */}

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Statistics"
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

export default Statistics;
