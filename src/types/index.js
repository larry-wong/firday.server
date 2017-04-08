/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-25 21:18
#
# Description:	
#
=============================================================================*/

'use strict';

const defaultType = {
    checkState: () => true
};

module.exports = ['button', 'switch', 'slider'].reduce((prev, name) => {
    prev[name] = Object.assign({}, defaultType, require(`./${name}`));
    return prev;
}, {});
