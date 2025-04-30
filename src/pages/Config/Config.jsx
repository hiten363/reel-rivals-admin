import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Input, Button, Switch, Checkbox, Chip } from '@material-tailwind/react';
import useMain from '@/hooks/useMain';

const Config = ({ notify }) => {
  const { getConfig, updateConfig, getReferralSettings, updateReferralSettings } = useMain();
  const [verificationStarPoints, setVerificationStarPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [referralSettings, setReferralSettings] = useState({
    active: true,
    referrerTokens: 50,
    referredTokens: 20,
    codeLength: 8,
    maxReferrals: 50,
    milestones: [
      { referralCount: 5, bonusTokens: 100, description: '5 successful referrals' },
      { referralCount: 10, bonusTokens: 250, description: '10 successful referrals' },
      { referralCount: 25, bonusTokens: 500, description: '25 successful referrals' }
    ]
  });

  useEffect(() => {
    fetchConfig();
    fetchReferralSettings();
  }, []);

  const fetchConfig = async () => {
    setInitialLoading(true);
    const res = await getConfig();
    if (res.status) {
      setVerificationStarPoints(res.data.verificationStarPoints || '');
    }
    setInitialLoading(false);
  };

  const fetchReferralSettings = async () => {
    const res = await getReferralSettings();
    if (res.status) {
      setReferralSettings(res.data);
    }
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

  const handleReferralSettingsChange = (field, value) => {
    setReferralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setReferralSettings(prev => {
      const updatedMilestones = [...prev.milestones];
      updatedMilestones[index] = {
        ...updatedMilestones[index],
        [field]: value
      };
      return {
        ...prev,
        milestones: updatedMilestones
      };
    });
  };

  const handleSaveReferralSettings = async () => {
    setLoading(true);
    const res = await updateReferralSettings(referralSettings);
    if (res.status) {
      notify('success', 'Referral settings updated successfully!');
    } else {
      notify('error', `Failed to update referral settings: ${res.message || 'Server error'}`);
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
                <Typography variant="small" className='font-medium' color="blue-gray">
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
              <Button onClick={handleSave} disabled={loading} color="green">
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Referral Settings
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {initialLoading ? (
            <Typography className="p-4">Loading referral settings...</Typography>
          ) : (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="small" className='font-medium' color="blue-gray">
                  Enable Referral System
                </Typography>
                <Switch
                  checked={referralSettings.active}
                  onChange={() => handleReferralSettingsChange('active', !referralSettings.active)}
                  color="green"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Typography variant="small" className='font-normal' color="blue-gray">
                    Referrer Star Points
                  </Typography>
                  <Input
                    type="number"
                    label="Star Points for Referrer"
                    value={referralSettings.referrerTokens}
                    onChange={(e) => handleReferralSettingsChange('referrerTokens', Number(e.target.value))}
                    placeholder="Enter Star Points for referrer"
                    min="0"
                  />
                  <Typography variant="caption" color="gray">
                    Star Points awarded to users when their referral completes verification.
                  </Typography>
                </div>

                <div className="flex flex-col gap-2">
                  <Typography variant="small" className='font-normal' color="blue-gray">
                    Referred User Star Points
                  </Typography>
                  <Input
                    type="number"
                    label="Star Points for New User"
                    value={referralSettings.referredTokens}
                    onChange={(e) => handleReferralSettingsChange('referredTokens', Number(e.target.value))}
                    placeholder="Enter Star Points for new users"
                    min="0"
                  />
                  <Typography variant="caption" color="gray">
                    Star Points awarded to new users who sign up using a referral code.
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Typography variant="small" className='font-normal' color="blue-gray">
                    Referral Code Length
                  </Typography>
                  <Input
                    type="number"
                    label="Code Length"
                    value={referralSettings.codeLength}
                    onChange={(e) => handleReferralSettingsChange('codeLength', Number(e.target.value))}
                    placeholder="Enter code length"
                    min="5"
                    max="12"
                  />
                  <Typography variant="caption" color="gray">
                    Length of automatically generated referral codes (5-12 characters).
                  </Typography>
                </div>

                <div className="flex flex-col gap-2">
                  <Typography variant="small" className='font-normal' color="blue-gray">
                    Maximum Referrals Per User
                  </Typography>
                  <Input
                    type="number"
                    label="Max Referrals"
                    value={referralSettings.maxReferrals}
                    onChange={(e) => handleReferralSettingsChange('maxReferrals', Number(e.target.value))}
                    placeholder="Enter maximum referrals"
                    min="1"
                  />
                  <Typography variant="caption" color="gray">
                    Maximum number of successful referrals a user can make.
                  </Typography>
                </div>
              </div>

              <div className="space-y-3">
                <Typography variant="small" className='font-medium' color="blue-gray">
                  Referral Milestones
                </Typography>
                <Typography variant="caption" color="gray">
                  Set bonus Star Points for users who reach specific referral milestones.
                </Typography>

                {referralSettings.milestones.map((milestone, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg flex flex-col gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        type="number"
                        label="Referral Count"
                        value={milestone.referralCount}
                        onChange={(e) => handleMilestoneChange(index, 'referralCount', Number(e.target.value))}
                        min="1"
                      />
                      <Input
                        type="number"
                        label="Bonus Star Points"
                        value={milestone.bonusTokens}
                        onChange={(e) => handleMilestoneChange(index, 'bonusTokens', Number(e.target.value))}
                        min="0"
                      />
                      <Input
                        type="text"
                        label="Description"
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleSaveReferralSettings} disabled={loading} color="green">
                {loading ? 'Saving...' : 'Save Referral Settings'}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Config;
