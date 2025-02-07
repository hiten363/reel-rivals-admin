import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { UAParser } from 'ua-parser-js';

const LogDetail = ({ data }) => {
  let parser = new UAParser(data.userAgent);
  let parserResults = parser.getResult();

  return (
    <>
      <Card className="h-full w-full overflow-scroll p-4">
        <div className="flex gap-2 mb-0.5">
          <b className='text-black font-semibold'>Browser:</b>
          <p className='text-black'>{parserResults?.browser?.name} ({parserResults?.browser?.version})</p>
        </div>
        <div className="flex gap-2 mb-0.5">
          <b className='text-black font-semibold'>CPU:</b>
          <p className='text-black'>{parserResults?.cpu?.architecture}</p>
        </div>
        <div className="flex gap-2 mb-0.5">
          <b className='text-black font-semibold'>Device:</b>
          <p className='text-black'>{parserResults?.device?.model}</p>
        </div>
        <div className="flex gap-2 mb-0.5">
          <b className='text-black font-semibold'>OS:</b>
          <p className='text-black'>{parserResults?.os?.name}</p>
        </div>
      </Card>
    </>
  );
};

const Log = () => {
  const { getLogs } = useMain();
  const [data, setData] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    startDate: '',
    endDate: ''
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const columns = [
    {
      name: 'Activity',
      selector: row => row.activity,
      wrap: true
    },
    {
      name: 'User IP',
      selector: row => row.userIp,
      wrap: true,
    },
    {
      name: 'Page Url',
      selector: row => row.pageUrl,
      wrap: true,
    },
    {
      name: 'User',
      selector: row => row.isAnonymous === "true" ? "Guest" : row.user.userName,
      wrap: true,
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getLogs(value.startDate, value.endDate, page, perPage);
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
    const ans = await getLogs(value.startDate, value.endDate, 1, perPage);
    setTotalRows(ans.count);
    setPage(1);
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
    const ans = await getLogs('', '', 1, perPage);
    setData(ans.data);
    setValue({
      startDate: '',
      endDate: ''
    });
    setTotalRows(ans.count);
    setPage(1);
  };

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

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
              expandableRows
              expandableRowsComponent={LogDetail}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Log;
