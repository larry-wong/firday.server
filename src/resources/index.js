/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-16 22:57
#
# Description:	
#
=============================================================================*/

'use strict';

module.exports = ['things', 'scenes', 'histories'].reduce((prev, name) => {
    prev[name] = require(`./${name}`);
    return prev;
}, {});
