import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import ReplyNewsLetterModal from './Modals/ReplyNewsLetterModal';
// import EditNewsLetterModal from './Modals/EditNewsLetterModal';
// import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import xlsx from "json-as-xlsx";

const NewsLetter = ({ notify }) => {
  const { getNewsLetters, deleteNewsLetter, undoNewsLetter } = useMain();

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
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    // {
    //   name: 'Status',
    //   selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Replied</span> : <span className='text-red-500 font-semibold'>Not Replied</span>,
    //   sortable: true
    // },
    // {
    //   name: "Actions",
    //   selector: row => <div className="flex justify-center">
    //     <Tooltip content={<p className='text-xs text-center w-full mx-auto'>Reply</p>} hoverDelay={60} arrowSize={7} padding={'6px'}>
    //       <div onClick={() => {
    //         setData1(row);
    //         document.getElementById('addReplyModal').classList.toggle('hidden');
    //       }} className='mr-2 cursor-pointer'>
    //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-reply-all-fill" viewBox="0 0 16 16">
    //           <path d="M8.021 11.9 3.453 8.62a.719.719 0 0 1 0-1.238L8.021 4.1a.716.716 0 0 1 1.079.619V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
    //           <path d="M5.232 4.293a.5.5 0 0 1-.106.7L1.114 7.945a.5.5 0 0 1-.042.028.147.147 0 0 0 0 .252.503.503 0 0 1 .042.028l4.012 2.954a.5.5 0 1 1-.593.805L.539 9.073a1.147 1.147 0 0 1 0-1.946l3.994-2.94a.5.5 0 0 1 .699.106z" />
    //         </svg>
    //       </div>
    //     </Tooltip>

    //     <div onClick={() => {
    //       setData1(row);
    //       document.getElementById('editNewsLetterModal').classList.toggle('hidden');
    //     }} className='mr-2 cursor-pointer'>
    //       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="update-icon bi bi-pencil-square" viewBox="0 0 16 16">
    //         <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
    //         <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
    //       </svg>
    //     </div>

    //     <div onClick={async () => {
    //       if (row.status === "true") {
    //         setId(row._id);
    //         setMsg("Are you sure you want to delete selected lead?");
    //         document.getElementById('deleteModal').classList.toggle('hidden');
    //       }
    //       else {
    //         let ans = await undoNewsLetter({ id: row._id });
    //         if (ans.status) {
    //           notify('success', 'NewsLetter recovered successfully');
    //           setRefreshFlag(!refreshFlag);
    //         }
    //         else {
    //           notify('error', 'Something went wrong');
    //         }
    //       }
    //     }} className='me-2 cursor-pointer'>
    //       {row.status === "true" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="delete-icon bi bi-x-square" viewBox="0 0 16 16">
    //         <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
    //         <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    //       </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
    //         <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
    //         <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
    //       </svg>}
    //     </div>
    //   </div>,
    //   grow: 0.5
    // }
  ];

  const getData = async () => {
    setLoadFlag(true)
    const ans = await getNewsLetters(value.status, value.query, page, perPage);
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
    const ans = await getNewsLetters(value.status, value.query, 1, perPage);
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
    const ans = await getNewsLetters();
    let data = [
      {
        sheet: "News Letter Subscriptions",
        columns: [
          { label: "Name", value: "name" },
          { label: "Email", value: 'email' },
        ],
        content: ans.data,
      }
    ];

    let settings = {
      fileName: "newsletter_subscriptions"
    };

    xlsx(data, settings);
  };

  return (
    <>
      {/* <ReplyNewsLetterModal data1={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} /> */}
      {/* <EditNewsLetterModal data={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} /> */}
      {/* <DeleteModal msg={msg} handleDelete={handleDelete} /> */}

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage News Letter
              </Typography>

              <Button color="red" className='ml-2' onClick={handleExport} children="Export Newsletter Subscriptions">Export Newsletter Subscriptions</Button>

              {/* <Button color="red" onClick={() => {
                document.getElementById('addNewsLetterModal').classList.toggle('hidden');
              }} children="Add Lead +">Add Lead +</Button> */}
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div>

              {/* <div className="flex items-center">
                <Select label="Status" children={<p>Status</p>} onChange={(e) => {
                  handleChange(e, 'status');
                }} value={value.status}>
                  <Option value="" children={<p>Select Status</p>}>Select Status</Option>
                  <Option value="true" children={<p>Replied</p>}>Replied</Option>
                  <Option value="false" children={<p>Not Replied</p>}>Not Replied</Option>
                </Select>
              </div> */}

              <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
            </form>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="News Letter"
              progressPending={loadFlag}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              paginationRowsPerPageOptions={[5,10,20,50,100]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default NewsLetter;
