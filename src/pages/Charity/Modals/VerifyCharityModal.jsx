import React, { useState } from 'react';
import useMain from '../../../hooks/useMain';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from '@material-tailwind/react';

const VerifyCharityModal = ({ charity, refreshData, notify, setSelectedCharity }) => {
  const { verifyCharity } = useMain();
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const verified = !charity.verified;
      const response = await verifyCharity({
        id: charity._id,
        verified: verified
      });

      if (response.status) {
        notify('success', `Charity ${verified ? 'verified' : 'unverified'} successfully`);
        refreshData();
        handleClose();
      } else {
        notify('error', response.message || 'Failed to update charity verification status');
      }
    } catch (error) {
      console.error('Error verifying charity:', error);
      notify('error', 'An error occurred while updating charity verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCharity(null);
    document.getElementById('verifyCharityModal').classList.toggle('hidden');
  };

  return (
    <div id="verifyCharityModal" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 hidden">
      <Dialog open={true} handler={handleClose} className="min-w-[35%]">
        <DialogHeader>
          {charity.verified ? 'Unverify Charity' : 'Verify Charity'}
        </DialogHeader>
        
        <DialogBody divider className="h-auto overflow-auto">
          <div className="space-y-4">
            <div>
              <Typography variant="h6">Charity Information</Typography>
              <div className="mt-2 space-y-2">
                <div>
                  <Typography variant="small" className="font-semibold">Name:</Typography>
                  <Typography variant="paragraph">{charity.name}</Typography>
                </div>
                
                <div>
                  <Typography variant="small" className="font-semibold">Description:</Typography>
                  <Typography variant="paragraph" className="line-clamp-3">{charity.description}</Typography>
                </div>
                
                <div>
                  <Typography variant="small" className="font-semibold">Category:</Typography>
                  <Typography variant="paragraph">{charity.category?.title || 'N/A'}</Typography>
                </div>
                
                <div>
                  <Typography variant="small" className="font-semibold">Created By:</Typography>
                  <Typography variant="paragraph">{charity.createdBy?.userName || 'Unknown'}</Typography>
                </div>
                
                <div>
                  <Typography variant="small" className="font-semibold">Created At:</Typography>
                  <Typography variant="paragraph">{new Date(charity.createdAt).toLocaleString()}</Typography>
                </div>
                
                <div>
                  <Typography variant="small" className="font-semibold">Current Status:</Typography>
                  <Typography 
                    variant="paragraph" 
                    className={charity.verified ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}
                  >
                    {charity.verified ? 'Verified' : 'Not Verified'}
                  </Typography>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Typography variant="paragraph" color="blue-gray" className="font-semibold">
                Are you sure you want to {charity.verified ? 'unverify' : 'verify'} this charity?
              </Typography>
              <Typography variant="small" color="gray" className="mt-1">
                {charity.verified 
                  ? 'Unverifying will remove the charity from verified listings and may affect its visibility and credibility.' 
                  : 'Verifying this charity confirms it has been reviewed and approved by the administration.'
                }
              </Typography>
            </div>
          </div>
        </DialogBody>
        
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="gray" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            color={charity.verified ? "red" : "green"} 
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? 'Processing...' : charity.verified ? 'Unverify' : 'Verify'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default VerifyCharityModal; 