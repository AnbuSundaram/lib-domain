const createDomain = require('../lib/create-domain')

module.exports = createDomain('order', {
  offlinePort: 4066,
  lambdaPort: 3008,
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
