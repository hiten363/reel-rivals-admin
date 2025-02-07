import React, { useEffect, useState } from "react";
import { TicketIcon, UsersIcon } from "@heroicons/react/24/solid";
import useMain from "@/hooks/useMain";

export function Home() {
  const { getDashboardData } = useMain();
  const [dashboardData, setDashboardData] = useState({});
  const [loadFlag, setLoadFlag] = useState(true);

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getDashboardData();
    setDashboardData(ans.data);
    setLoadFlag(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Users</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">{!loadFlag ? dashboardData?.users ? dashboardData?.users : 0 : 'Loading ..'}</p>
        </div>

        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total Categories</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">{!loadFlag ? dashboardData?.categories ? dashboardData?.categories : 0 : 'Loading ..'}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
