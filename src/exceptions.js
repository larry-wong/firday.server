/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-26 14:14
#
# Description:	
#
=============================================================================*/

'use strict';

const symbolFactory = () => Object.assign(Symbol(), {
    new: function(message) {
        return Object.assign(new Error(message), {
            name: this
        });
    }
});

module.exports = {
    PARAM_EXCRPTION: symbolFactory(),
    NOT_FOUND_ECXEPTION: symbolFactory(),
    DB_EXCEPTION: symbolFactory()
};
