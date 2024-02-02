const createDomain = require('../lib/create-domain')

module.exports = createDomain('item', {
  offlinePort: 4051,
  lambdaPort: 3007,
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
