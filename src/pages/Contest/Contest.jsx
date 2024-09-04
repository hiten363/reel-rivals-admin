import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import AddContestModal from './Modals/AddContestModal';
import EditContestModal from './Modals/EditContestModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import ModalImage from "react-modal-image";
import xlsx from "json-as-xlsx";
import AddRewardpoolModal from './Modals/AddRewardpoolModal';

const WinnerList = ({ data }) => {
  console.log(data);

  return (
    <>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  # Prize Allocation
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Prize
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Count
                </Typography>
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.events?.length === 0 ? 'No Winners' : data?.events?.map((e, index) => {
              const isLast = index === data?.events.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {index === 0 ? 'First Prize' : index === 1 ? 'Second Prize' : 'Third Prize'}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {e?.event?.title}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {e?.count}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
};

const Contest = ({ notify }) => {
  const { getContests, deleteContest, undoContest, getCategorys } = useMain();
  // console.log('yes');

  const navigate=useNavigate();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [id, setId] = useState(0);
  const [msg, setMsg] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    category: '',
    query: '',
    deleted: '',
    startDate: '',
    endDate: ''
  });
  const [categories, setCategories] = useState([]);
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [contest, setContest] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  const columns = [
    // {
    //   name: 'Event Image',
    //   selector: row => <ModalImage
    //     small={row?.img ? row?.img : '/img/user.png'}
    //     large={row?.img ? row?.img : '/img/user.png'}
    //     className='w-20 h-20 object-cover'
    //   />,
    //   sortable: true
    // },
    {
      name: 'Contest Name',
      selector: row => <Link to={`/dashboard/contests/${row.title}/${row._id}`}>{row.title}</Link>,
      // sortable: true,
      wrap: true
    },
    {
      name: 'Contest Category',
      // selector: row => <Link to={`/dashboard/event-users/${row._id}/${row.title}`}>{row.title}</Link>,
      selector: row => row.category?.title,
      // sortable: true,
      wrap: true
    },
    {
      name: 'Total Winnings',
      selector: row => row.winning,
      // sortable: true,
      wrap: true
    },
    {
      name: 'Start Date',
      selector: row => new Date(Number(row.startDate)).toLocaleDateString('en-GB'),
      // sortable: true,
      wrap: true
    },
    {
      name: 'End Date',
      selector: row => new Date(Number(row.endDate)).toLocaleDateString('en-GB'),
      // sortable: true,
      wrap: true
    },
    // {
    //   name: 'Status',
    //   selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Active</span> : <span className='text-red-500 font-semibold'>Finished</span>,
    //   sortable: true
    // },
    {
      name: 'Reward Pool',
      selector: row => row.rewardPool ? <button onClick={()=>{
        navigate(`/dashboard/rewardpool/${row?._id}`);
      }} className='bg-green-700 text-white px-2 text-[13px] py-1 rounded-sm'>View</button> : <button onClick={()=>{
        setContest(row?._id);
        document.getElementById('addRewardpoolModal').classList.toggle('hidden');
      }} className='bg-red-500 text-white px-2 text-[13px] py-1 rounded-sm'>Create</button>, 
      sortable: true
    },
    {
      name: 'Is Deleted?',
      selector: row => row.deleted === 'true' ? <span className='text-red-500 font-semibold'>Yes</span> : <span className='text-green-500 font-semibold'>No</span>,
      sortable: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        {row?.deleted === 'false' && <div onClick={() => {
          setData1(row);

          document.getElementById('editContestModal').classList.toggle('hidden');
        }} className='mr-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="update-icon bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
          </svg>
        </div>}

        <div onClick={async () => {
          if (row.deleted === "false") {
            setId(row._id);
            setMsg("Are you sure you want to delete selected Contest?");

            document.getElementById('deleteModal').classList.toggle('hidden');
          }
          else {
            let ans = await undoContest({ id: row._id });
            if (ans.status) {
              notify('success', 'Contest recovered successfully');
              setRefreshFlag(!refreshFlag);
            }
            else {
              notify('error', 'Something went wrong');
            }
          }
        }} className='me-2 cursor-pointer'>
          {row.deleted === "true" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="delete-icon bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>}
        </div>
      </div>,
      grow: 0.5
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getContests('', value.status, page, perPage, value.deleted);
    setData(ans.data);
    setTotalRows(ans.count);

    const ans1 = await getCategorys('', true);
    
    setCategories(ans1.data);
    setLoadFlag(false);
  };

  const handleDelete = async () => {
    console.log(id);
    const ans = await deleteContest(id);

    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('deleteModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
      document.getElementById('deleteModal').classList.toggle('hidden');
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
    const ans = await getContests('', value.status, 1, perPage, value.deleted, value.category, value.startDate && value.startDate!=="" ? new Date(value.startDate).getTime() : '', value.endDate && value.endDate!=="" ? new Date(value.endDate).getTime() : "");
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

  const handleExport = async () => {
    const ans = await getContests('', value.status, '', '', value.deleted);
    let data = [
      {
        sheet: "Contests",
        columns: [
          { label: "Event Name", value: "title" },
          { label: "Start Date & Time", value: row => new Date(Number(row.startDate)).toLocaleString('en-GB') },
          { label: "End Date & Time", value: row => new Date(Number(row.endDate)).toLocaleString('en-GB') },
          { label: "First Prize", value: row => row.events[0].event.title },
          { label: "Second Prize", value: row => row.events[1].event.title },
          { label: "Third Prize", value: row => row.events[2].event.title },
          { label: "Event Status", value: (e) => e.status === 'true' ? 'Active' : 'Finished' }
        ],
        content: ans.data,
      }
    ];

    let settings = {
      fileName: "contests"
    };

    xlsx(data, settings);
  };

  return (
    <>
      <AddContestModal setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <AddRewardpoolModal setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} contest={contest} />
      <EditContestModal data={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <DeleteModal msg={msg} handleDelete={handleDelete} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Contests
              </Typography>

              <div>
                <Button color="red" onClick={() => {
                  document.getElementById('addContestModal').classList.toggle('hidden');
                }} children="Add Contest +">Add Contest +</Button>
                {/* <Button color="red" className='ml-2' onClick={handleExport} children="Export Users">Export Contests</Button> */}
              </div>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form className="flex flex-col" onSubmit={handleSubmit}>
              {/* <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div> */}

              <div className='flex items-center justify-end px-10 pt-3'>
                <div className="flex items-center mr-2 max-w-sm">
                  {/* <Select label="Category" children={<p>Category</p>} onChange={(e) => {
                  handleChange(e, 'category');
                }} value={value?.category}>
                  <Option value="" children={<p>Select Category</p>}>Select Category</Option>
                  {categories?.map((e, index) => {
                    return (
                      <Option key={index} value={e._id} children={<p>{e?.title}</p>}>{e?.title}</Option>
                    );
                  })}
                </Select> */}

                  <select id="category" name="category" onChange={handleChange} value={value?.category} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value=''>Select Category</option>
                    {categories?.map((e, index) => {
                      return (
                        <option key={index} value={e._id}>{e?.title}</option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex items-center mr-2">
                  <Select label="Is Deleted?" children={<p>Is Deleted?</p>} onChange={(e) => {
                    handleChange(e, 'deleted');
                  }}>
                    <Option value="" children={<p>Select Status</p>}>Select Status</Option>
                    <Option value="true" children={<p>Deleted</p>}>Deleted</Option>
                    <Option value="false" children={<p>Not Deleted</p>}>Not Deleted</Option>
                  </Select>
                </div>
              </div>

              <div className='flex gap-2 items-center w-full justify-end px-10 pt-3'>
                <div className="flex items-center mr-2">
                  <label htmlFor="startDate" className="block w-28 mb-1.5 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                  <input type="date" id="startDate" name="startDate" value={value?.startDate} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <div className="flex items-center mr-2">
                  <label htmlFor="endDate" className="block w-28 mb-1.5 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                  <input type="date" id="endDate" name="endDate" value={value?.endDate} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
              </div>
            </form>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Contests"
              progressPending={loadFlag}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
            // expandableRows
            // expandableRowsComponent={WinnerList}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Contest;
