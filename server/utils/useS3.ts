import { S3Client } from '@aws-sdk/client-s3'

interface S3Config {
  client: S3Client
  bucketName: string
  publicUrl: string
}

let config: S3Config
export default function(): S3Config {
  if (!config) {
    const runtimeConfig = useRuntimeConfig()
    config = {
      client: new S3Client(useAwsConfig()),
      bucketName: runtimeConfig.s3?.bucketName,
      publicUrl: runtimeConfig.s3?.publicUrl
    }
  }
  return config
}
