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

const server = require('./server');

server.listen(process.argv[2] || 80);
