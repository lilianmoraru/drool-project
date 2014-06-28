Drool - Digital Currency Convertor
=========

How to set up:
---
* Install [NodeJS](http://nodejs.org/)
* Install [CouchDB](http://couchdb.apache.org/)
* Clone the repository 
```
git clone https://github.com/lilianmoraru/drool-project.git 
```
* Move into the `drool-project` folder
* Copy the contents of the `couchdb` folder into the **couchdb** databases folder:
    - On Unix-based operating systems it's in `/var/lib/couchdb/`
    - On Windows it's in the `[install path of couchdb]\var\lib\couchdb\`:
        * On 64-bit Windows usually in: `C:\Program Files (x86)\Apache Software Foundation\CouchDB\var\lib\couchdb`
        * On 32-bit Windows usually in: `C:\Program Files\Apache Software Foundation\CouchDB\var\lib\couchdb`

**From within the ``drool-project`` folder now start the server with:**
```
node ./bin/www
```
The server will be started on port 3000. 
Now you can load the page in the web browser `http://127.0.0.1:3000`

**This was a temporary project, the code won't be further maintained**