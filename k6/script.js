import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 16,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

export default function() {
  // Go service endpoints (port 8080)
  let goRootRes = http.get('http://golang-service:8080/');
  check(goRootRes, { 
    "go root status is 200": (r) => r.status === 200,
    "go root response is valid": (r) => r.body.length > 0
  });

  let goPingRes = http.get('http://golang-service:8080/ping');
  check(goPingRes, { 
    "go ping status is 200": (r) => r.status === 200,
    "go ping response is valid": (r) => r.body.length > 0
  });

  // Rust service endpoints (port 8081)
  let rustRootRes = http.get('http://rust-service:8081/');
  check(rustRootRes, { 
    "rust root status is 200": (r) => r.status === 200,
    "rust root response is valid": (r) => r.body.length > 0
  });

  let rustPingRes = http.get('http://rust-service:8081/ping');
  check(rustPingRes, { 
    "rust ping status is 200": (r) => r.status === 200,
    "rust ping response is valid": (r) => r.body.length > 0
  });

  sleep(1);
}
