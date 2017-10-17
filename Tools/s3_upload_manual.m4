#!/bin/sh

# Preprocessed constants

AWS_S3_ACCESS_KEY_ID=AKIAILQKUCGKJ33MUSPA
AWS_S3_SECRET_ACCESS_KEY=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
AWS_S3_CF_DISTRIBUTION_ID=d2xvjuq3wnsr5c
AWS_APP_NAME=Octo
AWS_S3_BUCKET_NAME=distribution-octo
AWS_S3_FOLDER_NAME=octo
AWS_SOFT_VERSION=1.0.3


#############################################
# Configuring credentials for access to AWS
#############################################

	aws configure set aws_access_key_id ${AWS_S3_ACCESS_KEY_ID} --profile octo
	aws configure set aws_secret_access_key ${AWS_S3_SECRET_ACCESS_KEY} --profile octo


#############################################
# Copying file to S3 bucket
#############################################

	# Meta-package
	aws s3 cp ${AWS_APP_NAME}.pkg "s3://${AWS_S3_BUCKET_NAME}/${AWS_S3_FOLDER_NAME}/${AWS_SOFT_VERSION}/${AWS_APP_NAME}.${AWS_SOFT_VERSION}.pkg" --acl public-read --profile octo
	# Source-package
	aws s3 cp "${AWS_APP_NAME}.source.pkg" "s3://${AWS_S3_BUCKET_NAME}/${AWS_S3_FOLDER_NAME}/${AWS_SOFT_VERSION}/${AWS_APP_NAME}.pkg" --acl public-read --profile octo


#############################################
# Cloudfront
#############################################

	aws configure set preview.cloudfront true
	aws cloudfront create-invalidation --distribution-id ${AWS_S3_CF_DISTRIBUTION_ID} --paths '/*' --profile octo
