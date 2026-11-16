import { ApiResponse } from '../api-response.presenter';

describe('ApiResponse', () => {
  it('expose statusCode, status et data avec les valeurs fournies', () => {
    const response = new ApiResponse(200, 'success', { foo: 'bar' });

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe('success');
    expect(response.data).toEqual({ foo: 'bar' });
  });

  it('accepte le status "failed"', () => {
    const response = new ApiResponse(500, 'failed', null);

    expect(response.status).toBe('failed');
    expect(response.data).toBeNull();
  });

  it('accepte un tableau en data', () => {
    const response = new ApiResponse(200, 'success', [1, 2, 3]);

    expect(response.data).toHaveLength(3);
  });
});
