import { useState, useEffect } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import { Button } from '@material-tailwind/react';

const EditChallengeModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateChallenge } = useMain();

  const [value, setValue] = useState({
    id: '',
    rewardAmount: 0
  });
  const [loadFlag, setLoadFlag] = useState(false);

  const handleChange = (e) => {
    setValue({ ...value, rewardAmount: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadFlag(true);

    try {
      const res = await updateChallenge({
        id: value.id,
        rewardAmount: value.rewardAmount
      });

      if (res && res.status) {
        notify('success', 'Challenge reward updated successfully');
        setRefreshFlag(!refreshFlag);
        document.getElementById('editChallengeModal').classList.toggle('hidden');
      } else {
        notify('error', res?.message || 'Failed to update challenge reward');
      }
    } catch (error) {
      console.error('Error updating challenge:', error);
      notify('error', 'An error occurred while updating the challenge');
    }

    setLoadFlag(false);
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setValue({
        id: data._id,
        rewardAmount: data.reward.amount
      });
    }
  }, [data]);

  return (
    <>
      <div id="editChallengeModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-md md:h-auto">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-5 border-b rounded-t">
              <h3 className="text-xl font-medium text-gray-900">
                Update Challenge Reward
              </h3>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('editChallengeModal').classList.toggle('hidden');
                }}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Update Reward Amount</h4>
                  {loadFlag && (
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  )}
                  {data && (
                    <div className="mb-4">
                      <h5 className="font-semibold">{data.title}</h5>
                      <p className="text-sm text-gray-600 mb-4">{data.description}</p>
                      <div>
                        <label htmlFor="rewardAmount" className="block mb-2 text-sm font-medium text-gray-900">
                          Star Points Reward Amount
                        </label>
                        <input
                          type="number"
                          id="rewardAmount"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Enter reward amount"
                          onChange={handleChange}
                          value={value.rewardAmount}
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div className="text-right">
                    <Button color="green" type="submit" disabled={loadFlag}>
                      {loadFlag ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditChallengeModal;
