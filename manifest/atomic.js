const createDomain = require('../lib/create-domain')

module.exports = createDomain('atomic', {
  offlinePort: 4055,
  lambdaPort: 3001,
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
