import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import AddMediaModal from './Modals/AddMediaModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import ModalImage from "react-modal-image";

const Media = ({ notify }) => {
  const { getMedias, deleteMedia, undoMedia } = useMain();
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
      name: 'Image',
      selector: row => <ModalImage
        small={row?.img ? row?.img : '/img/user.png'}
        large={row?.img ? row?.img : '/img/user.png'}
        className='w-20 h-20 object-cover'
      />,
      sortable: true,
      grow: 0.1
    },
    {
      name: 'Source',
      selector: row => <img className='w-7 h-7 object-cover' src={row.favicon} />,
      sortable: true,
      grow: 0.1
    },
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
      grow: 0.3
    },
    {
      name: 'Description',
      selector: row => row.desc.slice(0, 100) + ' ...',
      sortable: true,
      wrap: true,
      grow: 0.3
    },
    {
      name: 'Link',
      selector: row => <a className='text-blue-700 underline' href={row.url} target='_blank'>Link</a>,
      sortable: true,
      wrap: true,
      grow: 0.1
    },
    {
      name: 'Status',
      selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Active</span> : <span className='text-red-500 font-semibold'>Deleted</span>,
      sortable: true,
      grow: 0.1
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <div onClick={async () => {
          if (row.status === "true") {
            setId(row._id);
            setMsg("Are you sure you want to delete selected media link?");
            document.getElementById('deleteModal').classList.toggle('hidden');
          }
          else {
            let ans = await undoMedia({ id: row._id });
            if (ans.status) {
              notify('success', 'Media recovered successfully');
              setRefreshFlag(!refreshFlag);
            }
            else {
              notify('error', 'Something went wrong');
            }
          }
        }} className='me-2 cursor-pointer'>
          {row.status === "true" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="delete-icon bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
          </svg>}
        </div>
      </div>,
      grow: 0.1
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getMedias(value.status, value.query, page, perPage);
    console.log(ans);
    setData(ans.data);
    setTotalRows(ans.count);
    setLoadFlag(false);
  };

  const handleDelete = async () => {
    console.log(id);
    const ans = await deleteMedia(id);

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
    const ans = await getMedias(value.status, value.query, 1, perPage);
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
      <AddMediaModal setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <DeleteModal msg={msg} handleDelete={handleDelete} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Medias
              </Typography>
              <Button color="red" onClick={() => {
                document.getElementById('addMediaModal').classList.toggle('hidden');
              }} children="Add Media +">Add Media +</Button>
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
              title="Medias"
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

export default Media;
