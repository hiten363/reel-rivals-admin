import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Input, Button } from '@material-tailwind/react';
import useMain from '@/hooks/useMain';

const Config = ({ notify }) => {
  const { getConfig, updateConfig } = useMain();
  const [verificationStarPoints, setVerificationStarPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setInitialLoading(true);
    const res = await getConfig();
    if (res.status) {
      setVerificationStarPoints(res.data.verificationStarPoints || '');
    }
    setInitialLoading(false);
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await updateConfig({ verificationStarPoints });
    if (res.status) {
      notify('success', 'Configuration updated successfully!');
    } else {
      notify('error', `Failed to update configuration: ${res.message || 'Server error'}`);
    }
    setLoading(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Configuration Settings
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {initialLoading ? (
            <Typography className="p-4">Loading configuration...</Typography>
          ) : (
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <Typography variant="small" color="blue-gray">
                  Verification Star Points Incentive
                </Typography>
                <Input
                  type="number"
                  label="Star Points"
                  value={verificationStarPoints}
                  onChange={(e) => setVerificationStarPoints(e.target.value)}
                  placeholder="Enter number of points"
                  min="0"
                />
                <Typography variant="caption" color="gray">
                  Set the number of star points awarded to users upon successful verification.
                </Typography>
              </div>
              <Button onClick={handleSave} disabled={loading} color="blue">
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Config;
