import axios from 'axios';
import AccountServices from '../../../src/services/account.services';
import { BACKEND_URL } from '../../../src/helpers/environment';

jest.mock('../../../src/helpers/environment', () => ({
  BACKEND_URL: 'http://localhost:8888',
}));

// Mocking localStorage
const localStorageMock = {
  getItem: jest.fn(),
};

global.localStorage = localStorageMock;

// Mocking axios
jest.mock('axios');

describe('deleteAccount', () => {
  it('should delete an account and return data on success', async () => {
    const baseUser = '653629e474db8481662bd04c';
    const token = '653629e474db8481662bd04c'  // TODO: maybe this should differ from baseUser
    localStorageMock.getItem.mockReturnValue(baseUser);
    localStorageMock.getItem.mockReturnValue(token);

    const responseData = { success: true };
    axios.delete.mockResolvedValue({ data: responseData });

    const result = await AccountServices.deleteAccount();

    expect(result).toEqual(responseData);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('id');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    expect(axios.delete).toHaveBeenCalledWith(
      `${BACKEND_URL}/api/users/${baseUser}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should throw an error when account is not found in localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    await expect(AccountServices.deleteAccount()).rejects.toThrow('No account found in localStorage');
  });

  it('should throw an error when the delete request fails', async () => {
    const baseUser = '653629e474db8481662bd04c';
    localStorageMock.getItem.mockReturnValue(baseUser);

    const errorMessage = 'Failed to delete account';
    axios.delete.mockRejectedValue(new Error(errorMessage));

    await expect(AccountServices.deleteAccount()).rejects.toThrow(errorMessage);
  });

  it('should throw an error when the delete request returns an error response', async () => {
    const baseUser = '653629e474db8481662bd04c';
    localStorageMock.getItem.mockReturnValue(baseUser);

    const errorResponse = { message: 'Error deleting account' };
    axios.delete.mockRejectedValue({ response: { data: errorResponse } });

    try {
      await AccountServices.deleteAccount();
      // If no error was thrown, fail the test
      throw new Error('Expected an error to be thrown');
    } catch (error) {
      expect(error.message).toMatch('Error deleting account');
    }
  });


});
