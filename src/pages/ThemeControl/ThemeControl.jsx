import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import { SketchPicker } from 'react-color'

const ThemeControl = ({ notify }) => {
  const { getThemeControls, postThemeControls, updateThemeControls } = useMain();
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
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    getData();
  }, [refreshFlag]);

  const columns = [
    {
      name: 'Colour Code',
      selector: row => row.question,
      sortable: true
    },
    {
      name: 'Colour picker',
      selector: row => row.answer,
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Active</span> : <span className='text-red-500 font-semibold'>Deleted</span>,
      sortable: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <div onClick={() => {
        }} className='mr-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="update-icon bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
          </svg>
        </div>
      </div>,
      grow: 0.5
    }
  ];

  const getData = async () => {
    const ans = await getThemeControls(value.status, value.query);
    console.log(ans);
    if (ans.data.length !== 0) {
      setColor(ans.data[0].colorCode);
    }
    setData(ans.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let ans;
    if (data.length === 0) {
      // create
      ans = await postThemeControls({ colorCode: color });
    }
    else {
      // update
      ans = await updateThemeControls({ colorCode: color, id: data[0]._id });
    }
    console.log(ans);
    if (ans.status) {
      setData([ans.data]);
      notify('success', ans.message);
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Theme
              </Typography>
              {/* <Button color="red" onClick={() => {}} children="Add Theme +">Add Theme +</Button> */}
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <div className='flex justify-center items-center'>
              <div className="flex flex-col items-center">
                <SketchPicker color={color} onChange={(e) => {
                  console.log(e);
                  setColor(e.hex);
                }} />
                <Button color="red" onClick={(e) => { handleSubmit(e) }} children="Update Theme" className='mt-3'>Update Theme</Button>
              </div>
            </div>

            {/* <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Theme Control"
            /> */}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default ThemeControl;
