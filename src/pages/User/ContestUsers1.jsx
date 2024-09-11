import React from 'react';
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import AddUserModal from './Modals/AddUserModal';
import EditUserModal from './Modals/EditUserModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography, Select, Option, Input } from '@material-tailwind/react';
import { NavLink, useParams } from 'react-router-dom';
import ModalImage from "react-modal-image";
import xlsx from "json-as-xlsx";

const ContestUser1 = ({ notify }) => {
  const { getUsers, deleteUser, updateUserStatus } = useMain();

  const { contestName, contestId } = useParams();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [id, setId] = useState(0);
  const [msg, setMsg] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    role: '',
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
      name: 'Image',
      // selector: row => <img src={row?.img ? row?.img : '/img/user.png'} style={{width: '50px', padding:'5px 0px'}} />,
      selector: row => <ModalImage
        small={row?.img ? row?.img : '/img/user.png'}
        large={row?.img ? row?.img : '/img/user.png'}
        className='w-12 h-12 object-cover'
      />,
      sortable: true,
      grow: 0.4
    },
    {
      name: 'Name',
      selector: row => <NavLink to={`/dashboard/reels/${row.name}/${row._id}/${contestName}/${contestId}`}>{row.name}</NavLink>,
      // selector: row => row.name,
      sortable: true
    },
    {
      name: 'Username',
      // selector: row => <NavLink to={`/dashboard/user/${row._id}/${row.name}/0/0`}>{row.name}</NavLink>,
      selector: row => row.userName,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Phone',
      selector: row => row.phone && row.phone !== "undefined" ? row.phone : ' - ',
      sortable: true
    },
    {
      name: 'Country',
      selector: row => row.country && row.country !== "undefined" && row.country.label ? row.country.label : ' - ',
      sortable: true
    },
    {
      name: 'State',
      selector: row => row.state && row.state !== "undefined" && row.state.label ? row.state.label : ' - ',
      sortable: true
    },
    // {
    //   name: 'Role',
    //   selector: row => row.role,
    //   sortable: true,
    //   grow: 0.2
    // },
    {
      name: 'Status',
      selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Active</span> : <span className='text-red-500 font-semibold'>Deleted</span>,
      sortable: true,
      grow: 0.2
    },
    {
      name: "Actions",
      selector: row => {
        return (
          row.role === "ADMIN" ? " - " : <div className="flex pt-2 justify-center">
            <div onClick={() => {
              setData1(row);
              document.getElementById('editUserModal').classList.toggle('hidden');
            }} className='mr-2 cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="update-icon bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>
            </div>

            <div onClick={async () => {
              if (row.status === "true") {
                setId(row._id);
                setMsg("Are you sure you want to block selected user?");
                document.getElementById('deleteModal').classList.toggle('hidden');
              }
              else {
                let ans = await updateUserStatus({ _id: row._id, status: "true" });
                if (ans.status) {
                  notify('success', 'User recovered successfully');
                  setRefreshFlag(!refreshFlag);
                }
                else {
                  notify('error', 'Something went wrong');
                }
              }
              // setId(row._id);
              // setMsg("Are you sure you want to delete selected user?");
              // document.getElementById('deleteModal').classList.toggle('hidden');
            }} className='me-2 cursor-pointer'>
              {row.status === "true" ? <img style={{ width: '22px', height: '22px', position: 'relative', top: '-4px' }} src="/img/2080101.png" alt="" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
              </svg>}
            </div>
          </div>
        )
      },
      grow: 0.2
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getUsers(value.status, value.role, value.query, page, perPage, '', contestId);
    // console.log(ans);
    setTotalRows(ans.count);
    setData([...ans.data.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })]);
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
    // console.log(value);
    const ans = await getUsers(value.status, value.role, value.query, 1, perPage, '', contestId);
    setTotalRows(ans.count);
    setPage(1);
    // console.log(ans);
    setData(ans.data);
  };

  const handleDelete = async () => {
    // console.log(id);
    const ans = await updateUserStatus({ _id: id, status: "false" });

    if (ans.status) {
      notify('success', 'User Blocked Successfully');
      setRefreshFlag(!refreshFlag);
      document.getElementById('deleteModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  const handleExport = async () => {
    const ans = await getUsers(value.status, value.role, value.query, 1, perPage, '', contestId);
    let data = [
      {
        sheet: "Users",
        columns: [
          { label: "Name", value: "name" },
          { label: "Email", value: 'email' },
          { label: "Phone", value: "phone" },
          { label: "Address", value: "address" },
          { label: "User Status", value: (e) => e.status === 'true' ? 'Active' : 'Inactive' },
        ],
        content: ans.data,
      }
    ];

    let settings = {
      fileName: "users"
    };

    xlsx(data, settings);
  };

  return (
    <>
      <AddUserModal setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <EditUserModal data={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <DeleteModal msg={msg} handleDelete={handleDelete} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Users
              </Typography>

              <div>
                <Button color="red" className='ml-2' onClick={handleExport} children="Export Users">Export Users</Button>
              </div>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
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
            </form>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title={`${contestName} Pariticipants`}
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

export default ContestUser1;
