import axios from 'axios';
import { ServiceEndpoint as API_GATEWAY_BASE_URL }  from '.build/stack.json'

test('returns the status', async () => {
  const { status } = await axios({
    url: `${API_GATEWAY_BASE_URL}/status`
  });
  expect(status).toEqual(200);
});