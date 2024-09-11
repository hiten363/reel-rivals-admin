import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";

const Log = ({ notify }) => {
  const { getLogs } = useMain();
  // console.log('yes');

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [id, setId] = useState(0);
  const [msg, setMsg] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    startDate: '',
    endDate: ''
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
      name: 'Question',
      selector: row => row.question,
      // sortable: true
    },
    {
      name: 'Answer',
      selector: row => <span className='my-2 block'>{`${row.answer.slice(0, 140)} ${row.answer?.length > 140 && '...'}`}</span>,
      wrap: true,
      // sortable: true
    },
    {
      name: 'Status',
      selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Active</span> : <span className='text-red-500 font-semibold'>Deleted</span>,
      // sortable: true,
      // grow: 0.1
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getLogs(value.status, value.query, page, perPage);
    console.log(ans);
    setData(ans.data);
    setTotalRows(ans.count);
    setLoadFlag(false);
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
    const ans = await getLogs(value.status, value.query, 1, perPage);
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

  const handleReset = async () => {
    // console.log(value);
    const ans = await getLogs();
    setValue({
      startDate: '',
      endDate: ''
    });
    setTotal(ans.totalAmount);
    setTotalRows(ans.count);
    setPage(1);
    setData(ans.data);
  };

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Logs
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className='flex gap-2 items-center w-full justify-end pt-3'>
                <div className="flex items-center mr-2">
                  <label htmlFor="startDate" className="block w-28 mb-0 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                  <input type="date" id="startDate" name="startDate" value={value?.startDate} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <div className="flex items-center mr-2">
                  <label htmlFor="endDate" className="block w-28 mb-0 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                  <input type="date" id="endDate" name="endDate" value={value?.endDate} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <Button type='submit' children="Filter" size='sm' className='ml-3 !overflow-visible' style={{ overflow: 'unset' }}>Filter</Button>

                <Button type='button' onClick={handleReset} children="Filter" size='sm' className='ml-3 !overflow-visible' style={{ overflow: 'unset' }}>Reset</Button>
              </div>
            </form>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Logs"
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

export default Log;
