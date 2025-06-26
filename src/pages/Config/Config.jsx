import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Switch
} from '@material-tailwind/react';
import useMain from '@/hooks/useMain';

const Config = ({ notify }) => {
  const {
    getConfig,
    updateConfig,
    getReferralSettings,
    updateReferralSettings
  } = useMain();

  const [verificationStarPoints, setVerificationStarPoints] = useState('');
  const [starPointToDollarRate, setStarPointToDollarRate] = useState('10');
  const [businessPayoutSettings, setBusinessPayoutSettings] = useState({
    minimumPayoutAmount: '10',
    minimumStarPoints: '100',
    processingFee: '0'
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [referralSettings, setReferralSettings] = useState({
    active: true,
    referrerTokens: 50,
    referredTokens: 20,
    codeLength: 8,
    maxReferrals: 50,
    milestones: [
      {
        referralCount: 5,
        bonusTokens: 100,
        description: '5 successful referrals'
      },
      {
        referralCount: 10,
        bonusTokens: 250,
        description: '10 successful referrals'
      },
      {
        referralCount: 25,
        bonusTokens: 500,
        description: '25 successful referrals'
      }
    ]
  });

  const fetchConfig = async () => {
    setInitialLoading(true);
    try {
      const res = await getConfig();
      if (res.status) {
        setVerificationStarPoints(res.data.verificationStarPoints || '');
        setStarPointToDollarRate(res.data.starPointToDollarRate || '10');
        setBusinessPayoutSettings({
          minimumPayoutAmount:
            res.data.businessPayoutSettings?.minimumPayoutAmount || '10',
          minimumStarPoints:
            res.data.businessPayoutSettings?.minimumStarPoints || '100',
          processingFee: res.data.businessPayoutSettings?.processingFee || '0'
        });
      }
    } finally {
      setInitialLoading(false);
    }
  };
  const fetchReferralSettings = async () => {
    const res = await getReferralSettings();
    if (res.status) {
      setReferralSettings(res.data);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      const configData = {
        verificationStarPoints,
        starPointToDollarRate,
        businessPayoutSettings: {
          minimumPayoutAmount: parseFloat(
            businessPayoutSettings.minimumPayoutAmount
          ),
          minimumStarPoints: parseInt(businessPayoutSettings.minimumStarPoints),
          processingFee: parseFloat(businessPayoutSettings.processingFee)
        }
      };
      const res = await updateConfig(configData);
      if (res.status) {
        notify('success', 'Configuration updated successfully!');
      } else {
        notify(
          'error',
          `Failed to update configuration: ${res.message || 'Server error'}`
        );
      }
    } catch (error) {
      notify('error', 'Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };
  const handleBusinessPayoutChange = (field, value) => {
    setBusinessPayoutSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleReferralSettingsChange = (field, value) => {
    setReferralSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleMilestoneChange = (index, field, value) => {
    setReferralSettings((prev) => {
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
    try {
      const res = await updateReferralSettings(referralSettings);
      if (res.status) {
        notify('success', 'Referral settings updated successfully!');
      } else {
        notify(
          'error',
          `Failed to update referral settings: ${res.message || 'Server error'}`
        );
      }
    } catch (error) {
      notify('error', 'Failed to update referral settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchReferralSettings();
  }, []);

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
                <Typography
                  variant="small"
                  className="font-medium"
                  color="blue-gray"
                >
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
                  Set the number of star points awarded to users upon successful
                  verification.
                </Typography>
              </div>

              <div className="flex flex-col gap-2">
                <Typography
                  variant="small"
                  className="font-medium"
                  color="blue-gray"
                >
                  Star Point to Dollar Conversion Rate
                </Typography>
                <Input
                  type="number"
                  label="Star Points per Dollar"
                  value={starPointToDollarRate}
                  onChange={(e) => setStarPointToDollarRate(e.target.value)}
                  placeholder="Enter conversion rate"
                  min="1"
                  step="0.1"
                />
                <Typography variant="caption" color="gray">
                  How many star points equal 1 USD (e.g., 10 means 10 star
                  points = $1)
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
            Business Payout Settings
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {initialLoading ? (
            <Typography className="p-4">
              Loading business payout settings...
            </Typography>
          ) : (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Typography
                    variant="small"
                    className="font-medium"
                    color="blue-gray"
                  >
                    Minimum Payout Amount (USD)
                  </Typography>
                  <Input
                    type="number"
                    label="Minimum Dollar Amount"
                    value={businessPayoutSettings.minimumPayoutAmount}
                    onChange={(e) =>
                      handleBusinessPayoutChange(
                        'minimumPayoutAmount',
                        e.target.value
                      )
                    }
                    placeholder="Enter minimum payout amount"
                    min="1"
                    step="0.01"
                  />
                  <Typography variant="caption" color="gray">
                    Minimum dollar amount businesses can request for payout.
                  </Typography>
                </div>

                <div className="flex flex-col gap-2">
                  <Typography
                    variant="small"
                    className="font-medium"
                    color="blue-gray"
                  >
                    Minimum Star Points Required
                  </Typography>
                  <Input
                    type="number"
                    label="Minimum Star Points"
                    value={businessPayoutSettings.minimumStarPoints}
                    onChange={(e) =>
                      handleBusinessPayoutChange(
                        'minimumStarPoints',
                        e.target.value
                      )
                    }
                    placeholder="Enter minimum star points"
                    min="1"
                  />
                  <Typography variant="caption" color="gray">
                    Minimum star points required in wallet to request payout.
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Typography
                  variant="small"
                  className="font-medium"
                  color="blue-gray"
                >
                  Processing Fee (%)
                </Typography>
                <Input
                  type="number"
                  label="Processing Fee Percentage"
                  value={businessPayoutSettings.processingFee}
                  onChange={(e) =>
                    handleBusinessPayoutChange('processingFee', e.target.value)
                  }
                  placeholder="Enter processing fee"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <Typography variant="caption" color="gray">
                  Processing fee percentage deducted from payouts (0-100%).
                </Typography>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <Typography
                  variant="small"
                  color="blue"
                  className="font-medium mb-2"
                >
                  Current Conversion Example
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {businessPayoutSettings.minimumStarPoints} star points = $
                  {(
                    parseInt(businessPayoutSettings.minimumStarPoints || 0) /
                    parseFloat(starPointToDollarRate || 1)
                  ).toFixed(2)}{' '}
                  USD
                </Typography>
                <Typography variant="small" color="blue-gray">
                  Minimum payout: ${businessPayoutSettings.minimumPayoutAmount}
                </Typography>
              </div>

              <Button onClick={handleSave} disabled={loading} color="green">
                {loading ? 'Saving...' : 'Save Business Settings'}
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
            <Typography className="p-4">
              Loading referral settings...
            </Typography>
          ) : (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Typography
                  variant="small"
                  className="font-medium"
                  color="blue-gray"
                >
                  Enable Referral System
                </Typography>
                <Switch
                  checked={referralSettings.active}
                  onChange={() =>
                    handleReferralSettingsChange(
                      'active',
                      !referralSettings.active
                    )
                  }
                  color="green"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Typography
                    variant="small"
                    className="font-normal"
                    color="blue-gray"
                  >
                    Referrer Star Points
                  </Typography>
                  <Input
                    type="number"
                    label="Star Points for Referrer"
                    value={referralSettings.referrerTokens}
                    onChange={(e) =>
                      handleReferralSettingsChange(
                        'referrerTokens',
                        Number(e.target.value)
                      )
                    }
                    placeholder="Enter Star Points for referrer"
                    min="0"
                  />
                  <Typography variant="caption" color="gray">
                    Star Points awarded to users when their referral completes
                    verification.
                  </Typography>
                </div>

                <div className="flex flex-col gap-2">
                  <Typography
                    variant="small"
                    className="font-normal"
                    color="blue-gray"
                  >
                    Referred User Star Points
                  </Typography>
                  <Input
                    type="number"
                    label="Star Points for New User"
                    value={referralSettings.referredTokens}
                    onChange={(e) =>
                      handleReferralSettingsChange(
                        'referredTokens',
                        Number(e.target.value)
                      )
                    }
                    placeholder="Enter Star Points for new users"
                    min="0"
                  />
                  <Typography variant="caption" color="gray">
                    Star Points awarded to new users who sign up using a
                    referral code.
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Typography
                    variant="small"
                    className="font-normal"
                    color="blue-gray"
                  >
                    Referral Code Length
                  </Typography>
                  <Input
                    type="number"
                    label="Code Length"
                    value={referralSettings.codeLength}
                    onChange={(e) =>
                      handleReferralSettingsChange(
                        'codeLength',
                        Number(e.target.value)
                      )
                    }
                    placeholder="Enter code length"
                    min="5"
                    max="12"
                  />
                  <Typography variant="caption" color="gray">
                    Length of automatically generated referral codes (5-12
                    characters).
                  </Typography>
                </div>

                <div className="flex flex-col gap-2">
                  <Typography
                    variant="small"
                    className="font-normal"
                    color="blue-gray"
                  >
                    Maximum Referrals Per User
                  </Typography>
                  <Input
                    type="number"
                    label="Max Referrals"
                    value={referralSettings.maxReferrals}
                    onChange={(e) =>
                      handleReferralSettingsChange(
                        'maxReferrals',
                        Number(e.target.value)
                      )
                    }
                    placeholder="Enter maximum referrals"
                    min="1"
                  />
                  <Typography variant="caption" color="gray">
                    Maximum number of successful referrals a user can make.
                  </Typography>
                </div>
              </div>

              <div className="space-y-3">
                <Typography
                  variant="small"
                  className="font-medium"
                  color="blue-gray"
                >
                  Referral Milestones
                </Typography>
                <Typography variant="caption" color="gray">
                  Set bonus Star Points for users who reach specific referral
                  milestones.
                </Typography>

                {referralSettings.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg flex flex-col gap-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        type="number"
                        label="Referral Count"
                        value={milestone.referralCount}
                        onChange={(e) =>
                          handleMilestoneChange(
                            index,
                            'referralCount',
                            Number(e.target.value)
                          )
                        }
                        min="1"
                      />
                      <Input
                        type="number"
                        label="Bonus Star Points"
                        value={milestone.bonusTokens}
                        onChange={(e) =>
                          handleMilestoneChange(
                            index,
                            'bonusTokens',
                            Number(e.target.value)
                          )
                        }
                        min="0"
                      />
                      <Input
                        type="text"
                        label="Description"
                        value={milestone.description}
                        onChange={(e) =>
                          handleMilestoneChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSaveReferralSettings}
                disabled={loading}
                color="green"
              >
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
