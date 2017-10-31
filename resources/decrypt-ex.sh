#!/bin/sh


ZN_GUID=@ZN_GUID
MK_USER_INSTALLATION_INFO_FILE="/Library/Preferences/.${ZN_GUID}"

MK_INSTALLATION_INFO_PUBLIC_KEY=@PUBLIC_KEY


MK_PREVIOUS_INSTALLATION_INFO=

if [ -f "$MK_USER_INSTALLATION_INFO_FILE" ]; then # file exists and it is a regular file
	# local MK_INSTALLATION_INFO_PUBLIC_KEY_FILE # temp file with specific prefix
	MK_INSTALLATION_INFO_PUBLIC_KEY_FILE=$(mktemp -t SP) 

	echo "$MK_INSTALLATION_INFO_PUBLIC_KEY\c" > "${MK_INSTALLATION_INFO_PUBLIC_KEY_FILE}"

	# local MK_INSTALLATION_INFO_BASE64
	MK_INSTALLATION_INFO_BASE64=$(mktemp -t SP) # temp file for base64-decoded INSTALLATION_INFO
	openssl base64 -A -d -in ${MK_USER_INSTALLATION_INFO_FILE} > $MK_INSTALLATION_INFO_BASE64

	for ((i=0; i<=4096; i++)) {
		CHUNK=$(cat ${MK_INSTALLATION_INFO_BASE64} | dd bs=512 count=1 skip=$i 2>/dev/null | openssl rsautl -verify -pubin -inkey $MK_INSTALLATION_INFO_PUBLIC_KEY_FILE 2>/dev/null)
		if [ $? -ne 0 ]; then
			break
		fi
		MK_PREVIOUS_INSTALLATION_INFO="${MK_PREVIOUS_INSTALLATION_INFO}${CHUNK}" # append decoded chunks to MK_PREVIOUS_INSTALLATION_INFO
	}

	# clean up
	rm "${MK_INSTALLATION_INFO_BASE64}"
	rm "${MK_INSTALLATION_INFO_PUBLIC_KEY_FILE}"

	echo "${MK_PREVIOUS_INSTALLATION_INFO}"
fi

