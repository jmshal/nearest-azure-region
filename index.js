const regions = require('./regions.json');
const haversineDistance = require('./haversineDistance');

async function handleRequest(request) {
  let nearestRegion;
  let nearestDistance = Infinity;

  for (const region of regions) {
    const distance = haversineDistance(region, request.cf);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestRegion = region;
    }
  }

  return new Response(JSON.stringify({
    id: nearestRegion.id,
    group: nearestRegion.group,
    name: nearestRegion.name,
    location: nearestRegion.location,
  }, null, '  '), {
    headers: {
      'access-control-allow-origin': '*',
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

addEventListener('fetch', (event) => {
  event.respondWith(
    handleRequest(event.request).catch((err) => (
      new Response(err.stack, { status: 500 })
    ))
  );
});
