const createDomain = require('../lib/create-domain')

module.exports = createDomain('cart', {
  offlinePort: 4011,
  lambdaPort: 3002,
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
        'lambda:listAliases',
        'lambda:listVersionsByFunction',
        'lambda:deleteFunction',
        'lambda:listLayerVersions',
        'lambda:deleteLayerVersion'
      ],
      Resource: '*'
    }
  ]
})
