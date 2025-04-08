import http from "k6/http";
import { sleep, check } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

export const options = {
  vus: 1000,
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 501ms
  },
  stages: [
    { duration: "1m", target: 1000 }, // Ramp up to 1000 VUs over 10 minutes
    { duration: "1m", target: 1000 }, // Stay at 1000 VUs for 10 minutes
    { duration: "1m", target: 0 }, // Ramp down to 0 VUs over 10 minutes
  ],
};

const goRootCounter = new Counter("go_root_requests");
const goPingCounter = new Counter("go_ping_requests");
const rustRootCounter = new Counter("rust_root_requests");
const rustPingCounter = new Counter("rust_ping_requests");

const goRootSuccessRate = new Rate("go_root_success_rate");
const goPingSuccessRate = new Rate("go_ping_success_rate");
const rustRootSuccessRate = new Rate("rust_root_success_rate");
const rustPingSuccessRate = new Rate("rust_ping_success_rate");

const goRootDuration = new Trend("go_root_duration");
const goPingDuration = new Trend("go_ping_duration");
const rustRootDuration = new Trend("rust_root_duration");
const rustPingDuration = new Trend("rust_ping_duration");

export default function () {
  let goRootRes = http.get("http://golang-service:8080/");
  goRootCounter.add(1);
  goRootSuccessRate.add(goRootRes.status === 200, {
    service: "golang",
    endpoint: "root",
  });
  goRootDuration.add(goRootRes.timings.duration, {
    service: "golang",
    endpoint: "root",
  });
  check(goRootRes, {
    "go root status is 200": (r) => r.status === 200,
    "go root response is valid": (r) => r.body.length > 0,
  });

  let goPingRes = http.get("http://golang-service:8080/ping");
  goPingCounter.add(1);
  goPingSuccessRate.add(goPingRes.status === 200, {
    service: "golang",
    endpoint: "ping",
  });
  goPingDuration.add(goPingRes.timings.duration, {
    service: "golang",
    endpoint: "ping",
  });
  check(goPingRes, {
    "go ping status is 200": (r) => r.status === 200,
    "go ping response is valid": (r) => r.body.length > 0,
  });

  // Rust service endpoints (port 8081)
  let rustRootRes = http.get("http://rust-service:8081/");
  rustRootCounter.add(1);
  rustRootSuccessRate.add(rustRootRes.status === 200, {
    service: "rust",
    endpoint: "root",
  });
  rustRootDuration.add(rustRootRes.timings.duration, {
    service: "rust",
    endpoint: "root",
  });
  check(rustRootRes, {
    "rust root status is 200": (r) => r.status === 200,
    "rust root response is valid": (r) => r.body.length > 0,
  });

  let rustPingRes = http.get("http://rust-service:8081/ping");
  rustPingCounter.add(1);
  rustPingSuccessRate.add(rustPingRes.status === 200, {
    service: "rust",
    endpoint: "ping",
  });
  rustPingDuration.add(rustPingRes.timings.duration, {
    service: "rust",
    endpoint: "ping",
  });
  check(rustPingRes, {
    "rust ping status is 200": (r) => r.status === 200,
    "rust ping response is valid": (r) => r.body.length > 0,
  });

  sleep(1);
}
