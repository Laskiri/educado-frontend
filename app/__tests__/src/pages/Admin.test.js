import React from 'react';
import { renderer, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useSWR from 'swr';
import EducadoAdmin from '../../../src/pages/EducadoAdmin'; 

let contentCreators = [];

// Mocking dependencies
jest.mock('swr');

describe('EducadoAdmin Component', () => {

  it('shows empty state when no content creators are found', async () => {
    contentCreators = [];

    await renderer.act(async () => {
        component = renderer.create(
          <MemoryRouter>
            <EducadoAdmin />
          </MemoryRouter>
        );
      });
      expect(component.toJSON()).toMatchSnapshot();
  });

  it('fetches and displays application data correctly', async () => {
    const mockData = {
      data: {
        data: [
          {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            joinedAt: '2023-01-01T12:00:00.000Z', // Replace with your actual date
          },
          // Add more mock data as needed
        ],
      },
    };

    // Mock useSWR hook to return mock data
    useSWR.mockReturnValueOnce({ data: mockData, error: null });

    renderer(
      <MemoryRouter>
        <EducadoAdmin />
      </MemoryRouter>
    );

    // Wait for the component to render the data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      // Add more assertions based on your actual data structure
    });
  });

  it('filters applications based on search term', async () => {
    const mockData = {
      data: {
        data: [
          { _id: '1', firstName: 'Jørgen', lastName: 'Skovlag', email: 'JørgenSkovlag@gmail.com', joinedAt: '2011-11-11T12:00:00.000Z' },
          { _id: '2', firstName: 'Mads', lastName: 'Ingstrid', email: 'MIngstrid@hotmail.com', joinedAt: '2020-02-20T12:00:00.000Z' },
          
        ],
      },
    };

    // Mock useSWR hook to return mock data
    useSWR.mockReturnValueOnce({ data: mockData, error: null });

    render(
      <MemoryRouter>
        <EducadoAdmin />
      </MemoryRouter>
    );

    // Wait for the component to render the data
    await waitFor(() => {
      // Initial rendering with all data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    // Search for Jane
    userEvent.type(screen.getByPlaceholderText('Procure um aplicativo...'), 'Jane');

    // Wait for the component to update based on the search term
    await waitFor(() => {
      // Jane should be visible, John should not
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).toBeNull();
    });
  });
});