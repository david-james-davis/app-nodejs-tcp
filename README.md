# Getting Started

1. **Add a `.env` file** (see `.env.example` for reference).
2. **Install dependencies and start the TCP & API server**:
   ```sh
   npm install && npx ts-node server.ts
   ```
3. Find your local network IP on another computer (Computer B):
    Mac/Linux run: `ifconfig | grep "inet "`.
    Look for an IP like 192.168.x.x or 10.x.x.x
4. On Computer B, stream NASA ISS coordinates over TCP:
    (Replace 192.168.38.32 with your actual server's IP address)

    ```sh
    { while true; do
        curl -s "http://api.open-notify.org/iss-now.json"
        sleep 5
    done; } | nc 192.168.38.32 4242
    ```
5. You should see logs in the TCP server like this:
    ```
    [04:36:21 UTC] INFO (69164): Received message
        message: "{\"iss_position\": {\"latitude\": \"-43.8874\", \"longitude\": \"57.9093\"}, \"timestamp\": 1741754181, \"message\": \"success\"}"
    ```
<!-- * For a compatible frontend see [visual UI repo](https://github.com/david-james-davis/). -->
