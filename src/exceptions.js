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

const factory = () => Object.assign(Symbol(), {
    new: function(message) {
        return Object.assign(new Error(message), {
            name: this
        });
    }
});

module.exports = {
    PARAM_EXCRPTION: factory(),
    NOT_FOUND_EXCEPTION: factory(),
    UNAUTHORIZED_EXCEPTION: factory(),
    FORBIDDEN_EXCEPTION: factory(),
    DB_EXCEPTION: factory()
};
