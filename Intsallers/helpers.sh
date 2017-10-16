#!/bin/sh

#  helpers.sh
#  Stealthio
#
#  Created by Ivan on 8/29/17.
#  Copyright © 2017 ZEO Alliance. All rights reserved.


###############################################################################
# ExitWithError <error_message>
#	Shows error message and exits.
function ExitWithError()
{
	echo "$*"
	exit 1
}

###############################################################################
# ExitIfError <error_code> <error_message>
#	Shows error message and exits if the error code is not 0. If the error
#	code is 0, the function does nothing.
function ExitIfError()
{
	if [ "$1" -ne 0 ]; then
		shift
		ExitWithError "$@"
	fi
}
