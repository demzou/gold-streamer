import BvhParser from '../src/bvh/BvhParser';
import BvhStream from '../src/bvh/BvhStream';
import Broadcast from '../src/Broadcast';
import Server from '../src/Server';

let broadcastFor;
let web;
const source = [];
const destinations = [];

function init() {
  (async () => {
    return (await BvhParser).readFile();
  })().then((body) => {
    source.push(body);
  });

  const stream = new BvhStream({ source });

  /* first, initialise our broadcaster */
  web = new Server({ source });
  broadcastFor = new Broadcast({ source });
  broadcastFor.osc = {};

  destinations.push({ address: '127.0.0.1', port: 5001 });

  /* stick to a good update-rate of 50 fps */
  setInterval(update, 20);

  /**
   * the second interval takes care of
   * broadcasting message. here however we
   * throttle broadcasting messages a bit, so
   * that we only have to update every tenth
   * of a second (or less or more?).
   * this is to prevent the network or receiver
   * from overloading.
   */
  setInterval(broadcast, 100);
}

init();

function update() {
  source.forEach((body) => body.update());
}

function broadcast() {
  web.xyz();
  broadcastFor.osc.xyz({ dest: destinations });
  // broadcastFor.osc.xyz({ source: body, range: ['Head', 'LeftHand', 'RightHand', 'Hips'] });
}
