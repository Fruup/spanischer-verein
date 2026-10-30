# TODO

- [x] "Mehr laden" Button
- [ ] Kalender hübsch machen
- [ ] Seitenleiste hübsch machen
- [ ] Mobile UI
- [ ] Admin login
  - [x] Login flow via OTP
  - [ ] `ADDRESS_HEADER` / `XFF_DEPTH` für `getClientAddress()` festlegen — ohne das greift das Rate-Limit pro IP nicht: hinter einem Proxy teilen sich alle Requests einen Bucket, mit falscher Tiefe kann der Client den Header fälschen
  - [x] Globales Limit zusätzlich zu den Pro-IP-Buckets — ein verteilter Angriff bekommt sonst pro IP einen frischen Bucket
  - [ ] Beim Blocking: blockierte Einträge vom Prune der vollen Buckets ausnehmen, sonst hebt sich der Block selbst auf
- [ ] Das ganze Editing Thema
- [ ] Media Library
  - [ ] imgproxy or [imagor](https://docs.imagor.net/), serving local images on shared volume
    - imagor supports caching
