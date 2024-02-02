const createDomain = require('../lib/create-domain')

module.exports = createDomain('identity', {
  offlinePort: 4031,
  lambdaPort: 3005,
  private: true,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'lambda:InvokeFunction',
        'secretsmanager:GetResourcePolicy',
        'secretsmanager:GetSecretValue',
        'secretsmanager:DescribeSecret',
        'secretsmanager:ListSecretVersionIds',
        'cognito-idp:*',
        'kms:*',
        'lambda:listAliases',
        'lambda:listVersionsByFunction',
        'lambda:deleteFunction',
        'lambda:listLayerVersions',
        'lambda:deleteLayerVersion'
      ],
      Resource: '*'
    }
  ],
  serverless: {
    plugins: ['serverless-plugin-split-stacks'],
    custom: {
      splitStacks: {
        perFunction: true,
        perType: false
      }
    }
  }
})
