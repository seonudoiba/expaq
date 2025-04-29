import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaUsers, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useNotification } from '../providers/NotificationContext';

interface BookingFormProps {
  activityId: number;
  price: number;
  capacity: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ activityId, price, capacity }) => {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkInDate: '',
    numOfAdults: 1,
    numOfChildren: 0,
    guestFullName: '',
    guestEmail: '',
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const steps = [
    { number: 1, title: 'Select Date & Guests', icon: FaCalendar },
    { number: 2, title: 'Guest Information', icon: FaUsers },
    { number: 3, title: 'Payment', icon: FaCreditCard },
    { number: 4, title: 'Confirmation', icon: FaCheckCircle }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bookings/activity/${activityId}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInDate: formData.checkInDate,
          numOfAdults: formData.numOfAdults,
          numOfChildren: formData.numOfChildren,
          guestFullName: formData.guestFullName,
          guestEmail: formData.guestEmail
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }

      const data = await response.json();
      showNotification('success', 'Booking confirmed successfully!');
      setStep(5);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return price * (parseInt(formData.numOfAdults.toString()) + parseInt(formData.numOfChildren.toString()));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((s, index) => (
          <div key={s.number} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s.number ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              <s.icon />
            </div>
            <div className="text-xs mt-2 text-gray-600">{s.title}</div>
            {index < steps.length - 1 && (
              <div 
                className={`h-1 w-20 mt-5 ${
                  step > s.number ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    name="numOfAdults"
                    value={formData.numOfAdults}
                    onChange={handleInputChange}
                    min="1"
                    max={capacity}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Children
                  </label>
                  <input
                    type="number"
                    name="numOfChildren"
                    value={formData.numOfChildren}
                    onChange={handleInputChange}
                    min="0"
                    max={capacity - formData.numOfAdults}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="guestFullName"
                  value={formData.guestFullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="guestEmail"
                  value={formData.guestEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {(formData.paymentMethod === 'credit' || formData.paymentMethod === 'debit') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="**** **** **** ****"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="***"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-4"
            >
              <div className="text-green-500 text-6xl">
                <FaCheckCircle className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h3>
              <p className="text-gray-600">
                Thank you for your booking. A confirmation email has been sent to {formData.guestEmail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Price per person</span>
            <span>${price}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
            <span>Number of guests</span>
            <span>{parseInt(formData.numOfAdults.toString()) + parseInt(formData.numOfChildren.toString())}</span>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 && step < 4 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ml-auto ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : step === 4 ? (
              'Confirm Booking'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;