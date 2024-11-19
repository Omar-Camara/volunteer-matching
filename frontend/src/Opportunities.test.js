import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Opportunities from './App'; // Assuming Opportunities is in App.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Opportunities Component', () => {
    const mock = new MockAdapter(axios);

    const mockOpportunities = [
        { id: 1, title: 'Food Bank Volunteer', location: 'Chicago' },
        { id: 2, title: 'Animal Shelter Helper', location: 'New York' },
    ];

    beforeEach(() => {
        mock.onGet('http://127.0.0.1:5000/opportunities').reply(200, mockOpportunities);
    });

    test('filters opportunities based on search criteria', async () => {
        render(<Opportunities />);
        
        // Wait for opportunities to load
        expect(await screen.findByText(/Food Bank Volunteer/i)).toBeInTheDocument();
        expect(await screen.findByText(/Animal Shelter Helper/i)).toBeInTheDocument();

        // Type into the search fields
        const titleInput = screen.getByPlaceholderText(/Search by title/i);
        const locationInput = screen.getByPlaceholderText(/Search by location/i);
        const searchButton = screen.getByText(/Search/i);

        fireEvent.change(titleInput, { target: { value: 'Food Bank' } });
        fireEvent.change(locationInput, { target: { value: 'Chicago' } });
        fireEvent.click(searchButton);

        // Verify filtered results
        expect(screen.getByText(/Food Bank Volunteer/i)).toBeInTheDocument();
        expect(screen.queryByText(/Animal Shelter Helper/i)).not.toBeInTheDocument();
    });
});
