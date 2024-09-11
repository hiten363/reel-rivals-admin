import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import AddSanctionListModal from './Modals/AddSanctionListModal';
import EditSanctionListModal from './Modals/EditSanctionListModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";

const SanctionList = ({ notify }) => {
  const { getSanctionLists } = useMain();
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
      name: 'Country',
      selector: row => row.label,
      sortable: true
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getSanctionLists();
    if(ans && ans?.data?.length>0)
    {
      setData1(ans.data[0]);
      setData(ans.data[0].countries);
    }
    setTotalRows(ans.count);
    setLoadFlag(false);
  };

  return (
    <>
      <AddSanctionListModal setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <EditSanctionListModal data={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Sanctioned Countries
              </Typography>

              {data?.length===0 ? <Button color="red" onClick={() => {
                document.getElementById('addSanctionListModal').classList.toggle('hidden');
              }} children="Add List +">Add List +</Button> : <Button color="red" onClick={() => {
                document.getElementById('editSanctionListModal').classList.toggle('hidden');
              }} children="Update List">Update List</Button>}
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Sanctioned Countries"
              progressPending={loadFlag}
              pagination
              paginationTotalRows={totalRows}
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default SanctionList;
