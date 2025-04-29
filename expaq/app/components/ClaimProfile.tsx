import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaIdCard, FaImages, FaPhone } from 'react-icons/fa';

interface ClaimProfileProps {
  hostId: number;
  activityIds: number[];
}

const ClaimProfile: React.FC<ClaimProfileProps> = ({ hostId, activityIds }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idDocument: null as File | null,
    proofPhotos: [] as File[],
    description: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idDocument' | 'proofPhotos') => {
    if (e.target.files) {
      if (field === 'idDocument') {
        setFormData(prev => ({
          ...prev,
          idDocument: e.target.files![0]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          proofPhotos: Array.from(e.target.files!)
        }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Create form data for file upload
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'proofPhotos') {
        value.forEach((photo: File) => {
          formDataToSend.append('proofPhotos', photo);
        });
      } else if (key === 'idDocument' && value) {
        formDataToSend.append('idDocument', value);
      } else {
        formDataToSend.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`/api/hosts/${hostId}/claim`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to submit claim');
      }

      // Handle success
      setStep(5);
    } catch (error) {
      console.error('Error submitting claim:', error);
      // Handle error
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Claim Your Host Profile</h2>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 h-0.5 w-full bg-gray-200 -z-10"></div>
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= num ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            <FaCheck className={step >= num ? 'opacity-100' : 'opacity-0'} />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {step === 1 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Identity Verification</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Government-issued ID
                  </label>
                  <div className="flex items-center space-x-4">
                    <FaIdCard className="text-3xl text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'idDocument')}
                      className="w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Activity Verification</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photos of your activities
                  </label>
                  <div className="flex items-center space-x-4">
                    <FaImages className="text-3xl text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e, 'proofPhotos')}
                      className="w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us about your experience
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                ></textarea>
              </div>
            </>
          )}

          {step === 5 && (
            <div className="text-center py-8">
              <div className="text-green-500 text-6xl mb-4">
                <FaCheck className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Claim Request Submitted!
              </h3>
              <p className="text-gray-600">
                We'll review your information and get back to you within 2-3 business days.
              </p>
            </div>
          )}
        </motion.div>

        {step < 5 && (
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ml-auto"
            >
              {step === 4 ? 'Submit Claim' : 'Continue'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ClaimProfile;