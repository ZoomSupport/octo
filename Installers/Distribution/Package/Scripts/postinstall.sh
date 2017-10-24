#!/bin/sh

########################
# Patched Constants
########################

#@INSTALLATION_INFO
#@AFFID
#@BUNDLEID
#@CHANNEL
#@SOURCE_VERSION

########################
# Project Constants
########################

SOURCE_VERSION="1.0.3"
MK_INSTALLATION_PATH="/Applications/Octo.app"

ZN_GUID="6165E8D6-04F5-4DDB-808A-97C62665E73B"
MK_INSTALLATION_INFO_FILE="/Library/Preferences/.${ZN_GUID}"
MK_USER_INSTALLATION_INFO_FILE="${HOME}/Library/Preferences/.${ZN_GUID}"
MK_INSTALLER_CONFIG_PATH="/tmp/com.zoomsupport.Octo.installer.config"

MK_INSTALL_VERSION=${SOURCE_VERSION}

### Events ###
ZN_EVENTS_STEP="ZVInstallEvents"
ZN_EVENTS_ENDPOINT="http://event.kromtech.net/event.php"
ZN_PRODUCT_ID="252"

### Source Package ###

SOURCE_PACKAGE="Octo.pkg"
SOURCE_URL="http://octo-cdn.bestmacsoft.com/octo/${SOURCE_VERSION}/Octo.pkg"
RESULT_FILE="${TMPDIR}/${SOURCE_PACKAGE}"
MAX_RETRY_COUNT=10 # for package downloading
MAX_TIME=120  # download timeout


#####################
# Meta Package
#####################


########################
# Public Key
########################

MK_INSTALLATION_INFO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzxnpuvoNTS2OIU79hLyb\nxFN6nZjx17DLHLbI1IR3FkOc9oSKfBCj2Q4SaN9LKzcjhXMERrntzzmuU0fCia3p\n4wT/3PErqfVaPTFwjtYHRXaqcwcWUCP+93hQ/MDys+TmNtyRQrZO/mvFUbY2zasp\nuidV23SHGQBBQRjP3vdU7pDItUpo2qENvnX+5OyQRfmkYoOlfbemtdayPlvQu298\nvIN9FS7qX/HNdtF6rAC47e8uwZ5XBXP24dumf1E/72u3EsLafeBjZd+n6C8pl+Qk\nlMuQiyKwVhQs0zY1JcMVbyz/ifog1gDeLn3SkeK5ojmxWmjZJRZ6E3qkMZfCblGU\nswIDAQAB\n-----END PUBLIC KEY-----"


########################
# Check previous installation info
########################

MK_PREVIOUS_INSTALLATION_INFO=

if [ -f "$MK_USER_INSTALLATION_INFO_FILE" ]; then # file exists and it is a regular file
	local MK_INSTALLATION_INFO_PUBLIC_KEY_FILE # temp file with specific prefix
	MK_INSTALLATION_INFO_PUBLIC_KEY_FILE=$(mktemp -t SP) 

	echo "$MK_INSTALLATION_INFO_PUBLIC_KEY\c" > "${MK_INSTALLATION_INFO_PUBLIC_KEY_FILE}"

	local MK_INSTALLATION_INFO_BASE64
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
fi


########################
# Previous AFFID
########################

MK_PREVIOUS_AFFID=
if [ -n "MK_PREVIOUS_INSTALLATION_INFO" ]; then
	MK_PREVIOUS_AFFID=$(echo "$MK_PREVIOUS_INSTALLATION_INFO" | grep '"affid":"' | sed -e 's/^.*"affid":"\([^"]*\)".*$/\1/')
fi


########################
# DEVICE_ID
########################

MAC_ADDRESS=$(networksetup -getmacaddress en0 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}')
if [ -z "$MAC_ADDRESS" ]; then
	MAC_ADDRESS=$(networksetup -getmacaddress en1 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}')
fi

SERIAL_NUMBER=$(ioreg -c IOPlatformExpertDevice -d 2 | awk -F\" '/IOPlatformSerialNumber/{print $(NF-1)}')

DEVICE_ID=$(echo "${SERIAL_NUMBER}|${MAC_ADDRESS}" | sed -e 's/:/%3A/g;s/|/%7C/g')


###############
# Reinstall
##############

if [ -n "$INSTALLATION_INFO" ]; then # non-zero string
	if [ -e "${MK_INSTALLATION_PATH}" ]; then # already installed
		MK_CURRENT_VERSION=$(/usr/libexec/PlistBuddy -c "Print:CFBundleShortVersionString" "${MK_INSTALLATION_PATH}/Contents/Info.plist")
		if [ $? -ne 0 ]; then
			MK_CURRENT_VERSION=
		fi

		# form REINSTALL_DATA
		REINSTALL_DATA="step=${ZN_EVENTS_STEP}&affid=${AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=Reinstall_${MK_CURRENT_VERSION}"
		if [ -n "$MK_PREVIOUS_AFFID" ]; then
			REINSTALL_DATA="${REINSTALL_DATA}&payload={\"previousAffid\":\"${MK_PREVIOUS_AFFID}\"}"
		fi

		curl -q -f --silent --data "$REINSTALL_DATA" "${ZN_EVENTS_ENDPOINT}"
	elif [ -f "$MK_USER_INSTALLATION_INFO_FILE" ]; then # Welcome Back
		WELCOMEBACK_DATA="step=${ZN_EVENTS_STEP}&affid=${AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=WelcomeBack"
		if [ -n "$MK_PREVIOUS_AFFID" ]; then
			WELCOMEBACK_DATA="${WELCOMEBACK_DATA}&payload={\"previousAffid\":\"${MK_PREVIOUS_AFFID}\"}"
		fi
		curl -q -f --silent --data "$WELCOMEBACK_DATA" "${ZN_EVENTS_ENDPOINT}"
	fi


	echo "${INSTALLATION_INFO}" > "${MK_INSTALLATION_INFO_FILE}"
	rm -f "${MK_USER_INSTALLATION_INFO_FILE}"
fi


#####################
# Cleanup
#####################

if [ -f "$MK_INSTALLER_CONFIG_PATH" ]; then
	rm "$MK_INSTALLER_CONFIG_PATH"
fi


#####################
# Installation Config
#####################

if [ -n "$INSTALLATION_INFO" ]; then
	/usr/libexec/PlistBuddy -c "Add:INSTALLATION_INFO string $INSTALLATION_INFO" "$MK_INSTALLER_CONFIG_PATH" 2>/dev/null
fi

if [ -n "$AFFID" ]; then
	/usr/libexec/PlistBuddy -c "Add:AFFID string $AFFID" "$MK_INSTALLER_CONFIG_PATH" 2>/dev/null
fi

if [ -n "$BUNDLEID" ]; then
	/usr/libexec/PlistBuddy -c "Add:BUNDLEID string $BUNDLEID" "$MK_INSTALLER_CONFIG_PATH" 2>/dev/null
fi

if [ -n "$CHANNEL" ]; then
	/usr/libexec/PlistBuddy -c "Add:CHANNEL string $CHANNEL" "$MK_INSTALLER_CONFIG_PATH" 2>/dev/null
fi

if [ -e "$MK_INSTALLER_CONFIG_PATH" ]; then
	chmod a+rw "$MK_INSTALLER_CONFIG_PATH"
fi

if [ -n "$DEVICE_ID" ]; then
	/usr/libexec/PlistBuddy -c "Add:DEVICE_ID string $DEVICE_ID" "$MK_INSTALLER_CONFIG_PATH" 2>/dev/null
fi



#####################
#####################
# Source Package
#####################
#####################




###################
# Installer Config extraction
###################

INSTALLER_CONFIG_PATH=${MK_INSTALLER_CONFIG_PATH}
PRODUCT_AFFID=$(/usr/libexec/PlistBuddy -c "Print:AFFID" "$INSTALLER_CONFIG_PATH" 2>/dev/null)
if [ $? -ne 0 ]; then
	PRODUCT_AFFID=
fi

BUNDLEID=$(/usr/libexec/PlistBuddy -c "Print:BUNDLEID" "$INSTALLER_CONFIG_PATH" 2>/dev/null)
if [ $? -ne 0 ]; then
	BUNDLEID=
fi

DEVICE_ID=$(/usr/libexec/PlistBuddy -c "Print:DEVICE_ID" "$INSTALLER_CONFIG_PATH" 2>/dev/null)
if [ $? -ne 0 ]; then
	DEVICE_ID=
fi

# Download_Started
curl -q -f --silent "${ZN_EVENTS_ENDPOINT}?step=${ZN_EVENTS_STEP}&affid=${PRODUCT_AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=Download_Started"

# Download source package
curl -q -f --silent -L --retry ${MAX_RETRY_COUNT} -m ${MAX_TIME} "${SOURCE_URL}" -o "${RESULT_FILE}"

RESULT_CODE=$?

RETRY_COUNT=1
SLEEP_TIME=1

while [ ${RESULT_CODE} -ne 0 -a ${RETRY_COUNT} -le ${MAX_RETRY_COUNT} ]
do
	sleep ${SLEEP_TIME}

	# Download_Retry
	curl -q -f --silent "${ZN_EVENTS_ENDPOINT}?step=${ZN_EVENTS_STEP}&affid=${PRODUCT_AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=Download_Retry"

	curl -q -f -C - --silent -L --retry ${MAX_RETRY_COUNT} -m ${MAX_TIME} "${SOURCE_URL}" -o "${RESULT_FILE}"

	RESULT_CODE=$?

	let RETRY_COUNT=RETRY_COUNT+1
	let SLEEP_TIME=SLEEP_TIME*2
done

if [ ${RESULT_CODE} -eq 0 ]; then
	# Download_Finished
	curl -q -f --silent "${ZN_EVENTS_ENDPOINT}?step=${ZN_EVENTS_STEP}&affid=${PRODUCT_AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=Download_Finished"

	CHECK_OS_VERSION=$(sw_vers -productVersion)
	CHECK_OS_MAJOR_VERSION=$(echo "${CHECK_OS_VERSION}" | cut -d . -f 1)
	CHECK_OS_MINOR_VERSION=$(echo "${CHECK_OS_VERSION}" | cut -d . -f 2)

	# Gatekeeper
	if [ "${CHECK_OS_MAJOR_VERSION}" -eq 10 -a "${CHECK_OS_MINOR_VERSION}" -ge 11 ]; then
		spctl --assess --type install "${RESULT_FILE}"
	fi

	# Silent install

	# Install_Started 
		curl -q -f --silent "${ZN_EVENTS_ENDPOINT}?step=${ZN_EVENTS_STEP}&affid=${PRODUCT_AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=Install_Started"
	installer -pkg "${RESULT_FILE}" -target LocalSystem
	RESULT_CODE=$?
	if [ ${RESULT_CODE} -eq 0 ]; then
		# Install_Finished 
		curl -q -f --silent "${ZN_EVENTS_ENDPOINT}?step=${ZN_EVENTS_STEP}&affid=${PRODUCT_AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=Install_Finished"
	else
		# Install_Failed
		curl -q -f --silent "${ZN_EVENTS_ENDPOINT}?step=${ZN_EVENTS_STEP}&affid=${PRODUCT_AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=Install_Failed"
	fi
else
	# Download_Failed
	curl -q -f --silent "${ZN_EVENTS_ENDPOINT}?step=${ZN_EVENTS_STEP}&affid=${PRODUCT_AFFID}&bundleId=${BUNDLEID}&prodID=${ZN_PRODUCT_ID}&version=${MK_INSTALL_VERSION}&device_id=${DEVICE_ID}&substep=Download_Failed"
	RESULT_CODE=1
fi

exit ${RESULT_CODE}
