import { queryLocalDataset } from '../src/lib/db/dataset-store';

function testProjection() {
  const res = queryLocalDataset('world-cities', {
    search: 'Istanbul',
    fields: 'name,country,lat,lng',
    limit: 2,
  });

  console.log('Projected Istanbul result:', res?.data);
}

testProjection();
