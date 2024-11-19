import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search';

describe('Search Component', () => {
    test('renders input fields and search button', () => {
        render(<Search onSearch={jest.fn()} />);
        
        expect(screen.getByPlaceholderText(/Search by title/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Search by location/i)).toBeInTheDocument();
        expect(screen.getByText(/Search/i)).toBeInTheDocument();
    });

    test('calls onSearch with correct values when typing in inputs', () => {
        const mockOnSearch = jest.fn();
        render(<Search onSearch={mockOnSearch} />);
        
        const titleInput = screen.getByPlaceholderText(/Search by title/i);
        const locationInput = screen.getByPlaceholderText(/Search by location/i);

        // Simulate typing in inputs
        fireEvent.change(titleInput, { target: { value: 'Volunteer' } });
        fireEvent.change(locationInput, { target: { value: 'New York' } });

        // Expect onSearch to have been called with correct arguments
        expect(mockOnSearch).toHaveBeenLastCalledWith({ title: 'Volunteer', location: 'New York' });
    });

    test('calls onSearch when search button is clicked', () => {
        const mockOnSearch = jest.fn();
        render(<Search onSearch={mockOnSearch} />);
        
        const titleInput = screen.getByPlaceholderText(/Search by title/i);
        const locationInput = screen.getByPlaceholderText(/Search by location/i);
        const searchButton = screen.getByText(/Search/i);

        // Simulate typing in inputs and clicking search
        fireEvent.change(titleInput, { target: { value: 'Food Bank' } });
        fireEvent.change(locationInput, { target: { value: 'Chicago' } });
        fireEvent.click(searchButton);

        // Expect onSearch to have been called with correct arguments
        expect(mockOnSearch).toHaveBeenCalledWith({ title: 'Food Bank', location: 'Chicago' });
    });
});
