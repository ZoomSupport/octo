#!/bin/sh

#  createDistribution.sh
#  Stealthio
#
#  Created by Ivan on 9/12/17.
#  Copyright © 2017 Kovell Ventures Ltd. All rights reserved.

### Source Helpers ###
source ${SRCROOT}/${PROJECT_NAME}/Scripts/helpers.sh

### Constants ###
ERROR_PREFIX="PACKAGE BUILD ERROR:"

### Binaries ###
PACKAGES_BUILD="/usr/local/bin/packagesbuild"
PACKAGES_UTIL="/usr/local/bin/packagesutil"

### Project Variables ###
APP_NAME=${ZN_APP_NAME}
SIGN_PKG_IDENTITY=${ZN_CODE_INSTALLER_SIGN_IDENTITY}
PACKAGES_PROJECT_NAME=${APP_NAME}.distribution.pkgproj

###############################################################################
# singPackage
#    Signs package at specific destination
signPackage()
{
if ! productsign --sign "$SIGN_PKG_IDENTITY" "$1" "$2"
then
echo "productsign failed. packages will not be signed" > /dev/stderr
cp "$1" "$2"
fi
}

###############################################################################
# createPackages
#    Creates and signs packages. Packages stored at $DSTROOT
createPackages()
{
DSTPACKAGE=${DSTROOT}/${APP_NAME}.pkg

rm -rf "$DSTPACKAGE"

if [ -e ${PACKAGES_BUILD} ]; then
	echo "Creating package:"

	pushd ${PROJECT_DIR}/${PROJECT_NAME}

	# Clean up build directory
	rm -rf "Package/build"

	##############################
	# macOS 8 Package
	##############################

	### Update package version, set it to bundle version ###
	echo "Update package version:"
	${PACKAGES_UTIL} --file Distribution/Package/${PACKAGES_PROJECT_NAME} set package-1 version ${ZN_BUNDLE_VERSION}
	ExitIfError $? "${ERROR_PREFIX}: Could not update package version."

	### Build Package ###

	${PACKAGES_BUILD} Distribution/Package/${PACKAGES_PROJECT_NAME}
	ExitIfError $? "${ERROR_PREFIX}: Could not build the main package."

	### Sign Package ###
	echo "Sign package:"
	signPackage "Distribution/Package/build/$APP_NAME.pkg" "$DSTPACKAGE"

	echo ""
	echo "====================="
	echo "Build Successful! Distribution at: ${DSTPACKAGE}"
	echo "====================="
	echo ""

	popd
else
	echo "packagesbuild not found. Packages will not be built."
	echo "Download Packages utility from http://s.sudre.free.fr/"
fi
}

createDsymArchive()
{
OUTPUT_FILE="$DSTROOT/dsyms.zip"
rm -rf "$OUTPUT_FILE"
cd "$SYMROOT"
zip --quiet -r "$OUTPUT_FILE" "$CONFIGURATION"/*.dSYM
cd - > /dev/null
}


if [ ! -e "$DSTROOT" ]; then
mkdir -p "$DSTROOT"
fi


# Create metapackage
createPackages
