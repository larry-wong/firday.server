/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-04-10 21:09
#
# Description:	
#
=============================================================================*/

'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

module.exports = yaml.safeLoad(fs.readFileSync('config.yml', 'utf-8'));
