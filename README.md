# COVID-19 stats
Server to store COVID-19 data from [TrackCorona](https://www.trackcorona.live/) and perform
statistical calculations over them.

Due to project needs, this is project is currently only available in spanish.

## Requirements
* Reverse proxy as front-end (like [nginx](https://nginx.org/), for example) for proxy mode.
* NodeJS (coded on version 13.12.0)
* NPM (for installing dependencies)

## Startup guide
1. Put in the array countries.json all desired monitored countries
2. Run "node covid.js <bind_addr> <bind_port>"
    * **NOTE** if the argument "<bind_addr>" is "proxy", it will start in proxy mode and no static file will be served (they must be handled by the front-end server).
3. "Server started" will be displayed when the server is ready for requests

## Future upgrades
- [x] Option for running express http server in standalone mode (no proxy required)
- [ ] English version of the UI
- [ ] Dockerfile (maybe)

## Special thanks
* ExpressJS project https://expressjs.com/
* SQLite project https://www.sqlite.org/index.html
* NodeJS project https://nodejs.org/
* TrackCorona https://www.trackcorona.live/
* Materializecss project https://materializecss.com/
* ChartJS project https://www.chartjs.org/
* and, of course, myself
