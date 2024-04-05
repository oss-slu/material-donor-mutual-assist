// DonorForm.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DonorForm from './DonorForm';

describe('DonorForm component', () => {
  it('displays error message when Email is invalid', () => {
    render(<DonorForm />);
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText('Add Donor'));
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('displays error message when Zip Code is invalid', () => {
    render(<DonorForm />);
    fireEvent.change(screen.getByLabelText('Zip Code:'), { target: { value: '1234' } });
    fireEvent.click(screen.getByText('Add Donor'));
    expect(screen.getByText('Invalid zip code format')).toBeInTheDocument();
  });

  it('submits form when all fields are valid', () => {
    render(<DonorForm />);
    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Zip Code:'), { target: { value: '12345' } });
    fireEvent.click(screen.getByText('Add Donor'));
    // Here you can add assertions for form submission if needed
  });
});
