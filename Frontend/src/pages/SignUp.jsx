import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '', 
    mobile: '',
    postalCode: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validatePostalCode = async (postalCode) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`);
      const data = await res.json();
      if (data[0]?.Status === 'Success') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error validating postal code:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === '') {
      setError('Please choose a role.');
      return;
    }
    // Validate postal code
    const isValidPostalCode = await validatePostalCode(formData.postalCode);
    if (!isValidPostalCode) {
      setError('Invalid postal code. Please enter a valid Indian postal code.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/v1/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign up.');
      }

      setError(null);
      alert("User Created Successfully");
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'An error occurred while signing up. Please try again.');
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Name'
          className='border p-3 rounded-lg'
          id='name'
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          value={formData.email}
          onChange={handleChange}
        />
        <select
          id='role'
          value={formData.role}
          onChange={handleChange}
          className='border p-3 rounded-lg'
        >
          <option value=''>Choose a role</option>
          <option value='community member'>Community Member</option>
          <option value='community organization'>Community Organization</option>
          <option value='community business'>Community Business</option>
        </select>
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Mobile'
          className='border p-3 rounded-lg'
          id='mobile'
          value={formData.mobile}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Postal Code'
          className='border p-3 rounded-lg'
          id='postalCode'
          value={formData.postalCode}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}