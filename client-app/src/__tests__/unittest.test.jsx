// _tests_/unittests.test.jsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from '../Components/Login';

describe('Login Component', () => {
  test('renders login form correctly', () => {
    const { getByLabelText, getByText } = render(<Login />);
    
    const emailInput = getByLabelText('Email address');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByText('Submit');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('updates input value', () => {
    const { getByLabelText } = render(<Login />);
    
    const emailInput = getByLabelText('Email address');
    const passwordInput = getByLabelText('Password');
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
  
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('testpassword');
  });

  

  test('handles form submission correctly with valid credentials', async () => {
    const fakeAuthToken = 'fakeAuthToken';
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, authtoken: fakeAuthToken }),
    });

    const { getByLabelText, getByText } = render(<Login />);

    const emailInput = getByLabelText('Email address');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'email@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(localStorage.getItem('token')).toEqual(fakeAuthToken));
    expect(window.location.href).toBe('http://localhost/');
  });

  
});