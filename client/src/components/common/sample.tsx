import React, { useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  hostStatus: string;
}

const BecomeHostButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const requestToBeHost = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/users/${user?.id}/host-status`, { hostStatus: 'pending' });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveHost = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/users/${user?.id}/host-status`, { hostStatus: 'approved' });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const rejectHost = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/users/${user?.id}/host-status`, { hostStatus: 'rejected' });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user && (
        <div>
          <p>Current Host Status: {user.hostStatus}</p>
          {user.hostStatus === 'pending' && (
            <div>
              <button onClick={approveHost}>Approve</button>
              <button onClick={rejectHost}>Reject</button>
            </div>
          )}
        </div>
      )}
      <button onClick={requestToBeHost}>Request to be Host</button>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default BecomeHostButton;