import React from 'react';
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import AddUserModal from './Modals/AddUserModal';
import EditUserModal from './Modals/EditUserModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography, Select, Option, Input } from '@material-tailwind/react';
import { NavLink } from 'react-router-dom';
import ModalImage from "react-modal-image";
import xlsx from "json-as-xlsx";

const User = ({ notify }) => {
  const { getUsers, deleteUser, updateUserStatus } = useMain();

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
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const columns = [
    {
      name: 'Image',
      // selector: row => <img src={row?.img ? row?.img : '/img/user.png'} style={{width: '50px', padding:'5px 0px'}} />,
      selector: row => <div className='py-1'>
        <ModalImage
          small={row?.img ? row?.img : '/img/user.png'}
          large={row?.img ? row?.img : '/img/user.png'}
          className='w-12 h-12 object-cover'
        />
      </div>,
      sortable: true,
      grow: 0.4
    },
    {
      name: 'Name',
      selector: row => <NavLink to={`/dashboard/user/${row._id}/${row.name}`}>{row.name}</NavLink>,
      // selector: row => row.name,
      sortable: true,
      wrap: true
    },
    {
      name: 'Username',
      selector: row => row.userName,
      sortable: true,
      wrap: true
    },
    {
      name: 'D.O.B',
      selector: row => new Date(row.dob).toLocaleDateString(),
      sortable: true,
      wrap: true
    },
    {
      name: 'Verification Status',
      selector: row => row.isVerified === 'NOT' ? 'Not Verified' : row.isVerified === 'PARTIAL' ? 'Partially Verified' : row.isVerified === 'FULL' ? 'Fully Verified' : '',
      sortable: true,
      wrap: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      wrap: true
    },
    {
      name: 'Phone',
      selector: row => row.phone && row.phone !== "undefined" ? row.phone : ' - ',
      sortable: true,
      wrap: true
    },
    {
      name: 'Country',
      selector: row => row.country && row.country !== "undefined" && row.country.label ? row.country.label : ' - ',
      sortable: true,
      wrap: true
    },
    {
      name: 'State',
      selector: row => row.state && row.state !== "undefined" && row.state.label ? row.state.label : ' - ',
      sortable: true,
      wrap: true
    },
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
              setDeleteFlag(false);

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

            <div className='cursor-pointer' onClick={() => {
              setDeleteFlag(true);
              setId(row._id);
              setMsg("Are you sure you want to deleted selected user?");
              document.getElementById('deleteModal').classList.toggle('hidden');
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px] relative bottom-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>
          </div>
        );
      },
      grow: 0.2
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getUsers(value.status, value.role, value.query, page, perPage);
    setTotalRows(ans?.count);
    setData([...ans?.data?.sort((a, b) => {
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
    const ans = await getUsers(value.status, value.role, value.query, 1, perPage);
    setTotalRows(ans.count);
    setPage(1);
    // console.log(ans);
    setData(ans.data);
  };
  const handleDelete = async () => {
    // console.log(id);
    // console.log(deleteFlag);

    // Delete the user
    if (deleteFlag) {
      const ans = await deleteUser(id);

      if (ans.status) {
        notify('success', ans.message);
        setRefreshFlag(!refreshFlag);
        document.getElementById('deleteModal').classList.toggle('hidden');
      }
      else {
        notify('error', ans.message);
      }
    }
    // Block the user
    else {
      const ans = await updateUserStatus({ _id: id, status: "false" });

      if (ans.status) {
        notify('success', 'User Blocked Successfully');
        setRefreshFlag(!refreshFlag);
        document.getElementById('deleteModal').classList.toggle('hidden');
      }
      else {
        notify('error', ans.message);
      }
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
    const ans = await getUsers();
    let data = [
      {
        sheet: "Users",
        columns: [
          { label: "Name", value: "name" },
          { label: "Username", value: "userName" },
          { label: "Email", value: 'email' },
          { label: "Phone", value: "phone" },
          { label: "Country", value: (e) => e.country && e.country !== "undefined" && e.country.label ? e.country.label : ' - ' },
          { label: "State", value: (e) => e.state && e.state !== "undefined" && e.state.label ? e.state.label : ' - ' },
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

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

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
                <Button color="red" onClick={() => {
                  document.getElementById('addUserModal').classList.toggle('hidden');
                }} children="Add User +">Add User +</Button>

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
              title="Users"
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

export default User;
