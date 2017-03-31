/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-09 14:33
#
# Description:	
#
=============================================================================*/

'use strict';

const db = require('./database');
const pool = require('./pool');
const webServer = require('./web-server');

// Load things from db & create connections
db.things.find({}).then(([things]) => things.forEach(thing =>
    pool.createConnection(thing)));

// Start webserver
webServer.listen(process.argv[2] || 80);
