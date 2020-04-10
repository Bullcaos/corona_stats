# COVID-19 stats
Server to store COVID-19 data from [TrackCorona](https://www.trackcorona.live/) and perform
statistical calculations over them.

## Requirements
* Reverse proxy as front-end (like [nginx](https://nginx.org/), for example).
* NodeJS (coded on version 10.15.2)
* NPM (for installing dependencies)

## Startup guide
1. Put in the array countries.json all desired monitored countries
2. Run "node covid.js <bind_addr> <bind_port>"
    * **NOTE** the argument "<bind_addr>" is currently unused, but required for a future version :heart:
3. "Server started" will be displayed when the server is ready for requests

## Future upgrades
* Option for running express http server in standalone mode (no proxy required)
* Dockerfile (maybe)

## Special thanks
* ExpressJS project https://expressjs.com/
* SQLite project https://www.sqlite.org/index.html
* NodeJS project https://nodejs.org/
* TrackCorona https://www.trackcorona.live/
* Materializecss project https://materializecss.com/
* ChartJS project https://www.chartjs.org/
* and, of course, myself
