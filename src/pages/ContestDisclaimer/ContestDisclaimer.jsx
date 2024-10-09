import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import AddContestDisclaimerModal from './Modals/AddContestDisclaimerModal';
import EditContestDisclaimerModal from './Modals/EditContestDisclaimerModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import Spinner1 from '@/Util/Spinner1';


const ContestDisclaimer = ({ notify }) => {
  const { getContestDisclaimers } = useMain();
  // console.log('yes');

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [loadFlag, setLoadFlag] = useState(true);
  const [flag, setFlag] = useState(false);
  // const [id, setId] = useState(0);
  // const [msg, setMsg] = useState('');

  useEffect(() => {
    getData();
  }, [refreshFlag]);

  const columns = [
    {
      name: 'Details',
      selector: row => <div className='terms-main'><span dangerouslySetInnerHTML={{ __html: row.desc }}></span></div>,
      sortable: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <div onClick={() => {
          setData1(row);
          document.getElementById('editContestDisclaimerModal').classList.toggle('hidden');
        }} className='mr-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="update-icon bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
          </svg>
        </div>

        {/* <div onClick={async () => {
          if (row.status === "true") {
            setId(row._id);
            setMsg("Are you sure you want to delete selected blog?");
            document.getElementById('deleteModal').classList.toggle('hidden');
          }
          else {
            let ans = await undoContestDisclaimer({ id: row._id });
            if (ans.status) {
              notify('success', 'ContestDisclaimer recovered successfully');
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
        </div> */}
      </div>,
      grow: 0.5
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getContestDisclaimers();
    console.log(ans);
    setData(ans.data);
    setLoadFlag(false);
  };

  // const handleDelete = async () => {
  //   console.log(id);
  //   const ans = await deleteContestDisclaimer(id);

  //   if (ans.status) {
  //     notify('success', ans.message);
  //     setRefreshFlag(!refreshFlag);
  //     document.getElementById('deleteModal').classList.toggle('hidden');
  //   }
  //   else {
  //     notify('error', ans.message);
  //   }
  // };

  return (
    <>
      <AddContestDisclaimerModal setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <EditContestDisclaimerModal flag={flag} data={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      {/* <DeleteModal msg={msg} handleDelete={handleDelete} /> */}

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Contest Disclaimer
              </Typography>
              {data.length > 0 ? <Button color="red" onClick={() => {
                setData1(data[0]);
                document.getElementById('editContestDisclaimerModal').classList.toggle('hidden');
                setFlag(!flag);
              }} children="Edit" className='flex px-3 py-2'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                </svg>
                Edit</Button> : <Button color="red" onClick={() => {
                  document.getElementById('addContestDisclaimerModal').classList.toggle('hidden');
                }} children="Add +">Add +</Button>}
            </div>
          </CardHeader>

          {loadFlag ? <Spinner1 /> : <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <div className='terms-main'>
              <div style={{ padding: "0px 50px" }} dangerouslySetInnerHTML={{ __html: data[0]?.desc }}></div>
            </div>
          </CardBody>}
        </Card>
      </div>
    </>
  );
};

export default ContestDisclaimer;
