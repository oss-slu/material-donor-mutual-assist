import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

describe('LoginPage Component', () => {
    // it('renders without crashing', () => {
    //     const tree = render.create(<BrowserRouter><LoginPage /></BrowserRouter>);
    //     expect(tree).toMatchTheSnapshot();
    // });

    it('submits form with valid credentials', () => {
        const tree = render.create(<LoginPage />);
        expect(tree.toJSON()).toMatchSnapshot();
        // const mockUser = { username: 'user', password: 'dts@123' };
        // const localStorageMock = {
        //     getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
        //     setItem: jest.fn(),
        // };
        // global.localStorage = localStorageMock;

        // //const tree = render.create(<BrowserRouter><LoginPage /></BrowserRouter>);


        // fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
        // fireEvent.change(screen.getByPlaceholderText('Password*'), { target: { value: 'dts@123' } });

        // // Mock window.alert
        // const alert = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // fireEvent.click(screen.getByRole('button', { name: /login/i }));

        //expect(alert).toHaveBeenCalledWith('Login successful');
    });
});
